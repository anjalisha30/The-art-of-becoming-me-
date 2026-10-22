import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ==========================================
// 1. SET UP THE UNIVERSE
// ==========================================

const container = document.getElementById("galaxy-container");

if (!container) {
    throw new Error("Galaxy container not found in index.html");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#10091b");

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// ==========================================
// 2. CREATE THE MAIN PLANET
// ==========================================

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 96),
    new THREE.MeshStandardMaterial({
        color: "#b96ee8",
        roughness: 0.68,
        metalness: 0.04,
        emissive: "#351044",
        emissiveIntensity: 0.25
    })
);

scene.add(planet);

// ==========================================
// 3. ADD A GLOWING ATMOSPHERE
// ==========================================

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 64, 64),
    new THREE.MeshBasicMaterial({
        color: "#dba4ff",
        transparent: true,
        opacity: 0.13,
        side: THREE.BackSide,
        depthWrite: false
    })
);

scene.add(atmosphere);

// ==========================================
// 4. LIGHTING
// ==========================================

scene.add(
    new THREE.AmbientLight("#c7a7ff", 1.1)
);

const mainLight = new THREE.DirectionalLight("#ffffff", 3.2);
mainLight.position.set(-3, 4, 5);
scene.add(mainLight);

const rimLight = new THREE.PointLight("#b45cff", 5, 12);
rimLight.position.set(3, -1, -2);
scene.add(rimLight);

// ==========================================
// 5. CREATE A SECOND MOON
// ==========================================

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 48, 48),
    new THREE.MeshStandardMaterial({
        color: "#f2d9ff",
        roughness: 0.9,
        emissive: "#603878",
        emissiveIntensity: 0.3
    })
);

scene.add(moon);

// ==========================================
// 6. CREATE STARS
// ==========================================

const starPositions = [];

for (let i = 0; i < 1800; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
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
    opacity: 0.85,
    sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ==========================================
// 7. CREATE ORBITAL RINGS
// ==========================================

const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.42, 0.012, 8, 180),
    new THREE.MeshBasicMaterial({
        color: "#e8c2ff",
        transparent: true,
        opacity: 0.85
    })
);

ring.rotation.x = Math.PI / 2.7;
ring.rotation.y = Math.PI / 8;

scene.add(ring);

const secondRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.006, 8, 180),
    new THREE.MeshBasicMaterial({
        color: "#a56dd5",
        transparent: true,
        opacity: 0.4
    })
);

secondRing.rotation.x = Math.PI / 2.2;
secondRing.rotation.y = -Math.PI / 5;

scene.add(secondRing);

// ==========================================
// 8. MOUSE INTERACTION
// ==========================================

let mouseX = 0;
let mouseY = 0;

let targetRotationX = 0;
let targetRotationY = 0;

container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();

    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    targetRotationY = mouseX * 0.25;
    targetRotationX = mouseY * 0.15;
});

container.addEventListener("pointerleave", () => {
    targetRotationX = 0;
    targetRotationY = 0;
});

// ==========================================
// 9. RESPONSIVE RESIZING
// ==========================================

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

// ==========================================
// 10. ANIMATION
// ==========================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Rotate the main planet
    planet.rotation.y = elapsed * 0.18;

    // Keep the atmosphere aligned with the planet
    atmosphere.rotation.copy(planet.rotation);

    // Give the rings gentle movement
    ring.rotation.z = elapsed * 0.06;
    secondRing.rotation.z = -elapsed * 0.035;

    // Move the moon around the planet
    moon.position.set(
        Math.cos(elapsed * 0.55) * 1.85,
        Math.sin(elapsed * 0.55) * 0.35,
        Math.sin(elapsed * 0.55) * 0.75
    );

    // Slowly move the stars
    stars.rotation.y = elapsed * 0.008;

    // Smooth mouse-controlled movement
    planet.rotation.x +=
        (targetRotationX - planet.rotation.x) * 0.025;

    planet.rotation.y +=
        (targetRotationY - planet.rotation.y) * 0.025;

    renderer.render(scene, camera);
}

animate();