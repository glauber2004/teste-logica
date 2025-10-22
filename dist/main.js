import * as THREE from "three";
let scene;
let camera;
let renderer;
let material;
let partes = [];
init();
criarMovel();
animate();
function init() {
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
    material = new THREE.MeshLambertMaterial({ color: 0x8b7d6b });
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    const btn = document.getElementById("atualizar");
    if (btn)
        btn.addEventListener("click", atualizarMovel);
}
function getInputMeters(id, defaultMm) {
    const el = document.getElementById(id);
    const mm = el && el.value !== "" ? parseFloat(el.value) : defaultMm;
    return mm / 1000;
}
function limparPartes() {
    partes.forEach((o) => scene.remove(o));
    partes = [];
}
function criarMovel() {
    limparPartes();
    const largura = getInputMeters("comprimento", 1000);
    const profundidade = getInputMeters("profundidade", 500);
    const altura = getInputMeters("altura", 800);
    const espessura = getInputMeters("espessura", 18);
    function criaPlaca(w, h, d, x, y, z) {
        const geom = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        partes.push(mesh);
        return mesh;
    }
    // Criação das placas
    criaPlaca(largura, espessura, profundidade, 0, espessura / 2, 0); // base
    criaPlaca(largura, espessura, profundidade, 0, altura - espessura / 2, 0); // topo
    criaPlaca(espessura, altura, profundidade, -(largura / 2) + espessura / 2, altura / 2, 0); // lateral esquerda
    criaPlaca(espessura, altura, profundidade, (largura / 2) - espessura / 2, altura / 2, 0); // lateral direita
    criaPlaca(largura, espessura, profundidade, 0, altura / 2, 0); // prateleira central
    // ====================== FUROS ======================
    const profundidadeMm = profundidade * 1000;
    function qtdFurosPorProfundidade(mm) {
        if (mm <= 500)
            return 2;
        if (mm <= 1000)
            return 3;
        if (mm <= 1500)
            return 4;
        const extra = Math.floor((mm - 1500) / 500) + 1;
        return 4 + extra;
    }
    const qtdFuros = qtdFurosPorProfundidade(profundidadeMm);
    const holeRadius = 0.02;
    const holeColor = 0xff5a5a;
    const margemInferior = espessura + 0.02;
    const areaUtilProfundidade = Math.max(0, profundidade - 2 * margemInferior);
    const espacamento = qtdFuros > 1 ? areaUtilProfundidade / (qtdFuros - 1) : 0;
    // níveis (base, prateleira, topo)
    const niveisY = [espessura / 2, altura / 2, altura - espessura / 2];
    function criarFurosNaLateral(xLateral) {
        niveisY.forEach((y) => {
            for (let i = 0; i < qtdFuros; i++) {
                const z = -profundidade / 2 + margemInferior + i * espacamento;
                const esfera = new THREE.Mesh(new THREE.SphereGeometry(holeRadius, 12, 12), new THREE.MeshBasicMaterial({ color: holeColor }));
                esfera.position.set(xLateral, y, z);
                scene.add(esfera);
                partes.push(esfera);
            }
        });
    }
    // laterais esquerda e direita (encostadas)
    criarFurosNaLateral(-(largura / 2) + espessura / 2); // esquerda
    criarFurosNaLateral((largura / 2) - espessura / 2); // direita
}
function atualizarMovel() {
    criarMovel();
}
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.002;
    renderer.render(scene, camera);
}
