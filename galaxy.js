import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// Find the container in your HTML
const container = document.getElementById("galaxy-container");

if (!container) {
    throw new Error("Galaxy container not found in index.html");
}

// Create the 3D scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#10091b");

// Create the camera
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.z = 5;

// Create the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// Create the planet
const planetGeometry = new THREE.SphereGeometry(1, 64, 64);

const planetMaterial = new THREE.MeshStandardMaterial({
    color: "#c78bea",
    roughness: 0.8,
    metalness: 0.05
});

const planet = new THREE.Mesh(
    planetGeometry,
    planetMaterial
);

scene.add(planet);

// Add lighting
const ambientLight = new THREE.AmbientLight("#d9c2ff", 1.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight("#ffffff", 3);
mainLight.position.set(-3, 4, 5);
scene.add(mainLight);

// Create stars
const starPositions = [];

for (let i = 0; i < 1200; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );
}

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: "#f5e6ff",
    size: 0.035,
    transparent: true,
    opacity: 0.9
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create an orbital ring
const ringGeometry = new THREE.TorusGeometry(1.4, 0.012, 8, 150);

const ringMaterial = new THREE.MeshBasicMaterial({
    color: "#e8c2ff",
    transparent: true,
    opacity: 0.85
});

const ring = new THREE.Mesh(ringGeometry, ringMaterial);

ring.rotation.x = Math.PI / 2.7;
ring.rotation.y = Math.PI / 8;

scene.add(ring);

// Resize the scene when the browser/container changes size
function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

const resizeObserver = new ResizeObserver(resizeScene);
resizeObserver.observe(container);

// Animate the scene
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    planet.rotation.y = elapsed * 0.2;
    ring.rotation.z = elapsed * 0.08;
    stars.rotation.y = elapsed * 0.015;

    renderer.render(scene, camera);
}

animate();