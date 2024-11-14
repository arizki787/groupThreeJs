import * as THREE from 'three';
import { GUI } from 'dat.gui';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube with different colors on each face
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterials = [
    new THREE.MeshLambertMaterial({ color: 0xff0000 }), // red
    new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // green
    new THREE.MeshLambertMaterial({ color: 0x0000ff }), // blue
    new THREE.MeshLambertMaterial({ color: 0xffff00 }), // yellow
    new THREE.MeshLambertMaterial({ color: 0xff00ff }), // magenta
    new THREE.MeshLambertMaterial({ color: 0x00ffff })  // cyan
];
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
cube.position.set(-1.5, 0, 0);
scene.add(cube);

// Sphere with a purple color
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x800080 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0, 0);
scene.add(sphere);

const group = new THREE.Group();
group.add(cube);
group.add(sphere);
scene.add(group);

// Lighting (with shadows)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.set(3, 3, 3);
pointLight.castShadow = true;
scene.add(pointLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enable shadows for objects
cube.castShadow = true;
cube.receiveShadow = true;
sphere.castShadow = true;
sphere.receiveShadow = true;

camera.position.set(0, 5, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// GUI for camera position
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera Position');
cameraFolder.add(camera.position, 'x', -10, 10).name('X Position');
cameraFolder.add(camera.position, 'y', -10, 10).name('Y Position');
cameraFolder.add(camera.position, 'z', -10, 10).name('Z Position');

function createScaleController(object, gui){
    const scaleController = {
        scale: object.scale.x
    }
    const scaleFolder = gui.addFolder('Scale');
    scaleFolder.add(scaleController, 'scale', 0.1, 5).name('Uniform Scale').onChange(value => {
        object.scale.set(value, value, value);
    })
}
//gui for cube
const cubeFolder = gui.addFolder('Cube Attributes');
cubeFolder.add(cube.position, 'x', -10, 10).name('X Position');
cubeFolder.add(cube.position, 'y', -10, 10).name('Y Position');
cubeFolder.add(cube.position, 'z', -10, 10).name('Z Position');
createScaleController(cube, cubeFolder);

//gui for sphere
const sphereFolder = gui.addFolder('Sphere Attributes');
sphereFolder.add(sphere.position, 'x', -10, 10).name('X Position');
sphereFolder.add(sphere.position, 'y', -10, 10).name('Y Position');
sphereFolder.add(sphere.position, 'z', -10, 10).name('Z Position');
createScaleController(sphere, sphereFolder);

// GUI for group
const groupFolder = gui.addFolder('Group Attributes');
groupFolder.add(group.position, 'x', -10, 10).name('X Position');
groupFolder.add(group.position, 'y', -10, 10).name('Y Position');
groupFolder.add(group.position, 'z', -10, 10).name('Z Position');
createScaleController(group, groupFolder);

// Checkbox to toggle grouping
const options = {
    groupObjects: true,
    rotateGroup: false
};

gui.add(options, 'groupObjects').name('Group Objects').onChange(value => {
    if (value) {
        // Group the objects together
        group.add(cube);
        group.add(sphere);
        scene.add(group);
    } else {
        // Ungroup the objects
        group.remove(cube);
        group.remove(sphere);
        scene.remove(group);

        // Add the objects back to the scene independently
        scene.add(cube);
        scene.add(sphere);
    }
});

gui.add(options, 'rotateGroup').name('Rotate Group');

// Render loop
function animate() {
    requestAnimationFrame(animate);

    if (options.rotateGroup) {
        group.rotation.x += 0.01;
        group.rotation.y += 0.01;
        group.rotation.z += 0.01;
    }

    renderer.render(scene, camera);
}

animate();