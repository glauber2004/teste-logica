import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let material: THREE.MeshLambertMaterial;
let partes: THREE.Object3D[] = [];
let furosELinhas: THREE.Object3D[] = []; // Array separado para furos e linhas
let opacidadeAtiva = false; // Controla o estado da opacidade
let mostrarFuros = false; // Controla visibilidade dos furos
let dadosPecas: any[] = []; // Armazena dados das peças para exportação

init();
criarMovel();
animate();

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(1.5, 1.2, 2);
  camera.lookAt(0, 0.8, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(2, 4, 2);
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  scene.add(new THREE.GridHelper(5, 20));

  material = new THREE.MeshLambertMaterial({ 
    color: 0xb7d6b33, 
    opacity: 1.0, 
    transparent: true 
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const btn = document.getElementById("atualizar");
  if (btn) btn.addEventListener("click", atualizarMovel);

  const btnOpacidade = document.getElementById("opacidade");
  if (btnOpacidade) btnOpacidade.addEventListener("click", alternarOpacidade);

  const btnFuros = document.getElementById("furos");
  if (btnFuros) btnFuros.addEventListener("click", alternarFuros);

  const btnExportar = document.getElementById("exportar");
  if (btnExportar) btnExportar.addEventListener("click", exportarJSON);
}

function getInputMeters(id: string, defaultMm: number): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  const mm = el && el.value !== "" ? parseFloat(el.value) : defaultMm;
  return mm / 1000;
}

function limparPartes() {
  partes.forEach((o) => scene.remove(o));
  partes = [];
  furosELinhas.forEach((o) => scene.remove(o));
  furosELinhas = [];
  dadosPecas = []; // Limpa os dados das peças
}

function alternarOpacidade(): void {
  opacidadeAtiva = !opacidadeAtiva;
  
  if (opacidadeAtiva) {
    material.opacity = 0.1;
  } else {
    material.opacity = 1.0;
  }
  
  material.needsUpdate = true;
}

function alternarFuros(): void {
  mostrarFuros = !mostrarFuros;
  
  furosELinhas.forEach((obj) => {
    obj.visible = mostrarFuros;
  });
}

function criarMovel(): void {
  limparPartes();

  const largura = getInputMeters("comprimento", 1000);
  const profundidade = getInputMeters("profundidade", 500);
  const altura = getInputMeters("altura", 800);
  const espessura = getInputMeters("espessura", 18);

  let numeroPeca = 1; // Contador numeração das peças

  function criaPlaca(w: number, h: number, d: number, x: number,y: number, z: number, nome: string): THREE.Mesh {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    partes.push(mesh);

    // Armazena dados da peça(metros para mm)
    const dadosPeca = {
      numero: numeroPeca++,
      nome: nome,
      comprimento_mm: w * 1000,
      largura_mm: h * 1000,
      espessura_mm: d * 1000,
      furos: [] as any[]
    };
    dadosPecas.push(dadosPeca);

    return mesh;
  }

  // Criação das placas
  criaPlaca(largura, espessura, profundidade, 0, espessura / 2, 0, "Base"); // base
  criaPlaca(largura, espessura, profundidade, 0, altura - espessura / 2, 0, "Topo"); // topo
  criaPlaca(espessura, altura, profundidade, -(largura / 2) + espessura / 2, altura / 2, 0, "Lateral Esquerda"); // lateral esquerda
  criaPlaca(espessura, altura, profundidade, (largura / 2) - espessura / 2, altura / 2, 0, "Lateral Direita"); // lateral direita
  criaPlaca(largura, espessura, profundidade, 0, altura / 2, 0, "Prateleira Central"); // prateleira central

  // ====================== FUROS ======================
  const profundidadeMm = profundidade * 1000;
  const holeRadius = 0.02;
  const holeDiameter = holeRadius * 2 * 1000; // diâmetro em mm
  const holeProfundidade = 12; // profundidade do furo em mm

  function qtdFurosPorProfundidade(mm: number): number {
    if (mm <= 500) return 2;
    if (mm <= 1000) return 3;
    if (mm <= 1500) return 4;
    const extra = Math.floor((mm - 1500) / 500) + 1;
    return 4 + extra;
  }

  const qtdFuros = qtdFurosPorProfundidade(profundidadeMm);

  const holeColor = 0xff5a5a;
  const margemInferior = espessura + 0.02;
  const areaUtilProfundidade = Math.max(0, profundidade - 2 * margemInferior);
  const espacamento = qtdFuros > 1 ? areaUtilProfundidade / (qtdFuros - 1) : 0;

  // níveis (base, prateleira, topo)
  const niveisY = [espessura / 2, altura / 2, altura - espessura / 2];

  function criarFurosNaLateral(xLateral: number, numeroPecaLateral: number) {
    const linhaMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // verde

    niveisY.forEach((y) => {
      for (let i = 0; i < qtdFuros; i++) {
        const z = -profundidade / 2 + margemInferior + i * espacamento;

        // Adiciona furo aos dados da peça lateral
        dadosPecas[numeroPecaLateral].furos.push({
          x_mm: 0, // Na face da peça lateral, x é 0 (centro da espessura)
          y_mm: (y - altura / 2) * 1000, // Relativo ao centro da peça
          z_mm: (z + profundidade / 2) * 1000, // Relativo à borda frontal
          diametro_mm: holeDiameter,
          profundidade_mm: holeProfundidade
        });

        //bolinha vermelha
        const esfera = new THREE.Mesh(
          new THREE.SphereGeometry(holeRadius, 12, 12),
          new THREE.MeshBasicMaterial({ color: holeColor })
        );
        esfera.position.set(xLateral, y, z);
        esfera.visible = mostrarFuros;
        scene.add(esfera);
        furosELinhas.push(esfera); // Adiciona ao array de furos

        //linha verde de orientação
        const lineLength = 0.05; // comprimento da linha (5 cm)

        const start = new THREE.Vector3(xLateral, y, z);
        let end: THREE.Vector3;

        // direção conforme o nível da bolinha
        if (Math.abs(y - niveisY[0]) < 1e-6) {
          // Bolinhas de baixo → linha apontando para cima (Y aumenta)
          end = new THREE.Vector3(xLateral, y + lineLength, z);
        } else if (Math.abs(y - niveisY[1]) < 1e-6) {
          // Bolinhas do meio → linha apontando para o centro do móvel (X -> 0)
          // Se estiver na lateral esquerda (x < 0) somamos; se na direita (x > 0) subtraímos.
          const towardCenterX = xLateral < 0 ? xLateral + lineLength : xLateral - lineLength;
          end = new THREE.Vector3(towardCenterX, y, z);
        } else {
          // Bolinhas de cima → linha apontando para baixo (Y diminui)
          end = new THREE.Vector3(xLateral, y - lineLength, z);
        }

        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, linhaMaterial);
        line.visible = mostrarFuros;

        scene.add(line);
        furosELinhas.push(line); // Adiciona ao array de furos
      }
    });
  }

  // laterais esquerda e direita (encostadas)
  criarFurosNaLateral(-(largura / 2) + espessura / 2, 2); // esquerda (peça 3)
  criarFurosNaLateral((largura / 2) - espessura / 2, 3);  // direita (peça 4)
}

function atualizarMovel(): void {
  criarMovel();
}

function exportarJSON(): void {
  const dataStr = JSON.stringify(dadosPecas, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nome_peça.json';
  link.click();
  
  URL.revokeObjectURL(url);
}

function animate(): void {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.002;
  renderer.render(scene, camera);
}