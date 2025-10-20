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
    // Cena, câmera e renderizador
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(1.5, 1.2, 2);
    camera.lookAt(new THREE.Vector3(0, 0.8, 0));
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Luzes
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    // Grade auxiliar
    const grid = new THREE.GridHelper(5, 20);
    scene.add(grid);
    // Material
    material = new THREE.MeshLambertMaterial({ color: 0x8b7d6b });
    // Redimensionamento
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // Botão atualizar
    const botaoAtualizar = document.getElementById("atualizar");
    if (botaoAtualizar) {
        botaoAtualizar.addEventListener("click", atualizarMovel);
    }
    else {
        console.warn("⚠️ Botão 'atualizar' não encontrado no DOM.");
    }
}
function criarMovel() {
    // Apagar o móvel anterior
    partes.forEach((p) => scene.remove(p));
    partes = [];
    // Ler valores do formulário
    const getInputValue = (id) => {
        const input = document.getElementById(id);
        return input ? parseFloat(input.value) / 1000 : 0;
    };
    const largura = getInputValue("comprimento");
    const profundidade = getInputValue("profundidade");
    const altura = getInputValue("altura");
    const espessura = getInputValue("espessura");
    // Função auxiliar
    function placa(x, y, z, w, h, d) {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        partes.push(mesh);
    }
    // Montagem do móvel
    placa(0, espessura / 2, 0, largura, espessura, profundidade); // base
    placa(0, altura - espessura / 2, 0, largura, espessura, profundidade); // topo
    placa(-(largura / 2) + espessura / 2, altura / 2, 0, espessura, altura, profundidade); // lateral esquerda
    placa((largura / 2) - espessura / 2, altura / 2, 0, espessura, altura, profundidade); // lateral direita
    placa(0, altura / 2, 0, largura, espessura, profundidade); // prateleira central
}
function atualizarMovel() {
    criarMovel();
}
function animate() {
    scene.rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
