// src/main.ts
import * as THREE from 'three';

// Cria a cena
const scene: THREE.Scene = new THREE.Scene();

// Cria a câmera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Cria o renderizador
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define a geometria e o material
const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube: THREE.Mesh = new THREE.Mesh(geometry, material);

// Adiciona o cubo à cena
scene.add(cube);

// Posiciona a câmera
camera.position.z = 5;

// Função de animação
function animate(): void {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Inicia o loop de animação
renderer.setAnimationLoop(animate);

// Ajusta o tamanho ao redimensionar a janela
window.addEventListener('resize', (): void => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
