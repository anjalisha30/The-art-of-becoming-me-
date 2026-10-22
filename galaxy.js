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

// 💜 Planet of Dreams
const dreamPlanet = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 48, 48),
    new THREE.MeshStandardMaterial({
        color: "#f3a6e8",
        roughness: 0.7,
        emissive: "#63245f",
        emissiveIntensity: 0.35
    })
);

dreamPlanet.position.set(-2.0, 0.8, 0);
scene.add(dreamPlanet);


// 🌙 Planet of Poetry
const poetryPlanet = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 48, 48),
    new THREE.MeshStandardMaterial({
        color: "#a9c5ff",
        roughness: 0.75,
        emissive: "#293e83",
        emissiveIntensity: 0.3
    })
);

poetryPlanet.position.set(2.0, -0.65, 0);
scene.add(poetryPlanet);

// Make the planet clickable
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// ✨ Objects that respond to the mouse
const clickablePlanets = [
    planet,
    dreamPlanet,
    poetryPlanet
];

const originalPlanetScales = new Map();

clickablePlanets.forEach((p) => {
    originalPlanetScales.set(p, p.scale.clone());
});

const messagePanel = document.getElementById("planet-message");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");

const planetThoughts = [
    {
        title: "Learning to Love Myself",
        text: "I am learning to become someone I love without hating the person I am today."
    },
    {
        title: "The Person I'm Becoming",
        text: "I am allowed to be a work in progress and still be proud of how far I've come."
    },
    {
        title: "A Little Reminder",
        text: "I don't have to have my entire life figured out to deserve a little peace."
    }
];

let currentThought = 0;

// 💜 Give each planet its own story
const planetStories = new Map([
    [
        planet,
        {
            title: "The Art of Becoming Me",
            label: "MY JOURNEY ✧",
            text: "I am still discovering who I am. Somewhere between who I used to be and who I want to become, I am learning to appreciate the person I am today."
        }
    ],
    [
        dreamPlanet,
        {
            title: "A Girl Full of Dreams",
            label: "MY LITTLE UNIVERSE ✧",
            text: "There are so many things I want to do, places I want to see, and versions of myself I want to meet. I hope I never lose the courage to try."
        }
    ],
    [
        poetryPlanet,
        {
            title: "Things I Never Said",
            label: "LETTERS FROM MY HEART ✧",
            text: "Some feelings never find their way into conversations. They become poems, unsent letters, and little pieces of ourselves that we leave behind in words."
        }
    ]
]);



renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const clickablePlanets = [
        planet,
        dreamPlanet,
        poetryPlanet
    ];

    const hits = raycaster.intersectObjects(clickablePlanets);

    if (hits.length === 0) return;

    const selectedPlanet = hits[0].object;
    const story = planetStories.get(selectedPlanet);

    if (!story) return;

    const messagePanel = document.getElementById("planet-message");
    const messageTitle = document.getElementById("message-title");
    const messageText = document.getElementById("message-text");

    if (!messagePanel || !messageTitle || !messageText) {
        console.error("Planet message panel elements were not found.");
        return;
    }

    messageTitle.textContent = story.title;
    messageText.textContent = story.text;

    const messageLabel = messagePanel.querySelector(".message-label");

    if (messageLabel) {
        messageLabel.textContent = story.label;
    }

    messagePanel.classList.add("visible");
});

// Close the message panel
document.getElementById("close-message").addEventListener("click", () => {
    messagePanel.classList.remove("visible");
});

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

// Outer lavender glow
const outerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 64, 64),
    new THREE.MeshBasicMaterial({
        color: "#a855f7",
        transparent: true,
        opacity: 0.055,
        side: THREE.BackSide,
        depthWrite: false
    })
);

scene.add(outerGlow);

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

// ✨ Create stars with individual twinkle speeds

const starPositions = [];
const starPhases = [];
const starSpeeds = [];

for (let i = 0; i < 1800; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
    );

    starPhases.push(Math.random() * Math.PI * 2);
    starSpeeds.push(0.5 + Math.random() * 2);
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

// Store the original star brightness
const originalStarOpacity = 0.85;

// 🌌 Soft nebula clouds using blurred radial gradients

function createNebulaTexture() {
    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
        128, 128, 0,
        128, 128, 128
    );

    gradient.addColorStop(0, "rgba(190, 100, 255, 0.32)");
    gradient.addColorStop(0.3, "rgba(135, 70, 220, 0.18)");
    gradient.addColorStop(0.65, "rgba(100, 45, 180, 0.06)");
    gradient.addColorStop(1, "rgba(70, 30, 120, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

const nebulaTexture = createNebulaTexture();

const nebulaSprites = [];

function addNebula(x, y, z, scale, opacity) {
    const material = new THREE.SpriteMaterial({
        map: nebulaTexture,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(material);

    sprite.position.set(x, y, z);
    sprite.scale.set(scale * 1.5, scale, 1);

    scene.add(sprite);
    nebulaSprites.push(sprite);
}

addNebula(-3.0, 1.2, -5, 4.0, 0.65);
addNebula(2.8, -1.0, -6, 4.5, 0.55);
addNebula(0.0, 2.3, -7, 3.8, 0.45);
addNebula(-1.8, -2.0, -5, 3.5, 0.4);



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

// 💜 Make planets respond to the mouse
let hoveredPlanet = null;

container.addEventListener("pointermove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(clickablePlanets);

    hoveredPlanet = hits.length > 0 ? hits[0].object : null;

    renderer.domElement.style.cursor =
        hoveredPlanet ? "pointer" : "default";
});

container.addEventListener("pointerleave", () => {
    hoveredPlanet = null;
    renderer.domElement.style.cursor = "default";
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

    // ✨ Gentle twinkling stars
starMaterial.opacity = 0.65 + Math.sin(elapsed * 2) * 0.2;

// Make a few stars sparkle slightly brighter
starMaterial.size = 0.035 + Math.sin(elapsed * 3) * 0.008;



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
// ✨ Gently enlarge the planet under the mouse
clickablePlanets.forEach((p) => {
    const originalScale = originalPlanetScales.get(p);

    const targetScale =
        hoveredPlanet === p ? 1.12 : 1;

    p.scale.lerp(
        originalScale.clone().multiplyScalar(targetScale),
        0.08
    );
});
    renderer.render(scene, camera);
}

animate();