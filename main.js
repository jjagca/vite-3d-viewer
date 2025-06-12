import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const params = new URLSearchParams(window.location.search);
const modelName = params.get('model');
const modelPath = `models/${modelName}`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 2, 5);
scene.add(dirLight);

const loader = new GLTFLoader();
loader.load(modelPath, (gltf) => {
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  model.scale.setScalar(2 / size);
  scene.add(model);
}, undefined, (error) => {
  console.error('Failed to load model:', error);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();