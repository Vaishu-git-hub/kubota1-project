const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const textureLoader = new THREE.TextureLoader();
let currentModel;

const models = [
    'models/cube-globe4.gltf',
    'models/laptop1.gltf',
    'models/earth-moon4.gltf',
    'models/three.js_shapes2.gltf',
    'models/buildings.gltf'
];

const texts = [
    'Start',
    '',
    '',
    'These shapes are provided by the Three.js editor. They can be utilized to create a wide variety of 3D objects.',
    ''
];

const backgrounds = [
    new THREE.Color(0xffffff), // No specific background for cube-globe1
    new THREE.Color(0xffffff), // White background for laptop
    'models/space11.jfif', // Space background for earth-moon1
    'models/shapestexture.jfif', // Room background for three.js_shapes
    'models/envitext.jfif' // Environment background for buildings
];

let currentPage = 0;

function loadScene(modelPath, text, background) {
    loader.load(modelPath, (gltf) => {
        if (currentModel) {
            scene.remove(currentModel);
        }
        currentModel = gltf.scene;
        currentModel.scale.set(0.5, 0.5, 0.5); // Adjust the scale as needed

        // Position models based on their type
        if ( modelPath.includes('buildings')) {
            currentModel.position.set(0, -2, 0); // Position at the bottom
        } else {
            currentModel.position.set(0, 0, 0); // Center position
        }

        scene.add(currentModel);
        document.getElementById('text').innerText = text;

        if (background instanceof THREE.Color) {
            scene.background = background;
        } else if (typeof background === 'string') {
            textureLoader.load(background, (texture) => {
                scene.background = texture;
            });
        } else {
            scene.background = null; // Default background
        }
    });
}

function nextPage() {
    currentPage = (currentPage + 1) % models.length;
    loadScene(models[currentPage], texts[currentPage], backgrounds[currentPage]);
}

document.getElementById('container').addEventListener('click', nextPage);

loadScene(models[currentPage], texts[currentPage], backgrounds[currentPage]);

camera.position.set(0, 0, 5);

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        currentModel.rotation.y += deltaX * 0.01;
        currentModel.rotation.x += deltaY * 0.01;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

const autoRotateSpeed = 0.02;
const autoRotateDirection = new THREE.Vector3(0.2, 0.3, 0.1);

const animate = () => {
    requestAnimationFrame(animate);

    if (currentModel && !models[currentPage].includes('earth-moon4') && !models[currentPage].includes('buildings')) {
        currentModel.rotation.x += autoRotateSpeed * autoRotateDirection.x;
        currentModel.rotation.y += autoRotateSpeed * autoRotateDirection.y;
        currentModel.rotation.z += autoRotateSpeed * autoRotateDirection.z;
    }

    renderer.render(scene, camera);
};

animate();

