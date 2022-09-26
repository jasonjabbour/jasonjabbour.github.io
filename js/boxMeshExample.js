// Source: https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/
// Importing from Web
// import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
// import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

// Importing from local files
import * as THREE from '../lib/three/build/three.module.js'
import { OrbitControls } from '../lib/three/examples/jsm/controls/OrbitControls.js'
import { MeshSurfaceSampler } from './MeshSurfaceSampler.js'

// Import MeshSurfaceSampler from Original Locaiton
// import { MeshSurfaceSampler } from '../lib/three/examples/js/math/MeshSurfaceSampler.js'

// Choose the id element
const canvas = document.querySelector('#home')
// Define Width and Height
let width = canvas.offsetWidth
let height = canvas.offsetHeight

// Create an empty, needed for the renderer
const scene = new THREE.Scene()
// Create a camera and translate it
const camera = new THREE.PerspectiveCamera(70, width / height, .1, 1000)
// Set the position of camera
camera.position.set(10, 10, 10) // HERE
// Look at Center of Screen
camera.lookAt(0, 0, 0)

// Create a WebGL renderer and enable the antialias effect
const renderer = new THREE.WebGLRenderer({
    antialias: true, 
    // alpha: true,
})
renderer.setSize(width, height)
//Set Max Pixel Ration
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Append to renderer
canvas.appendChild(renderer.domElement)

// Add OrbitControls to allow the user to move in the scene
const controls = new OrbitControls(camera, renderer.domElement)

// Create an Geometry Group
const group = new THREE.Group()
scene.add(group)

// Create a cube with basic geometry & material
const geometry = new THREE.BoxGeometry(5,5,5)
const material = new THREE.MeshBasicMaterial({
    color: 0x0078ff,
    wireframe: true
})
const box = new THREE.Mesh(geometry, material)
group.add(box)

// Define the basic geometry of the spheres
const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 6);
// Define the basic material of the spheres
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x897E60
});
const spheres = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 300);
group.add(spheres);


//Instantiate a sampler so we can use it later
const sampler = new MeshSurfaceSampler(box).build();

// Create a dummy Vector to store the sampled coordinates
const tempPosition = new THREE.Vector3();
// Create a dummy 3D object to generate the Matrix of each sphere
const tempObject = new THREE.Object3D();
// Loop as many spheres we have
for (let i = 0; i < 300; i++) {
  // Sample a random point on the surface of the cube
  sampler.sample(tempPosition);
  // Store that point coordinates in the dummy object
  tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
  // Define a random scale
  tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
  // Update the matrix of the object
  tempObject.updateMatrix();
  // Insert the object udpated matrix into our InstancedMesh Matrix
  spheres.setMatrixAt(i, tempObject.matrix);
}


// // Resize Window Event Listener
window.addEventListener('resize', onResize)

// //Update Render
update()

// Update Render Function
function update(){
    // box.rotation.z += .05
    group.rotation.y += .01
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
// renderer.setAnimationLoop(update);

// Resize Window Function
function onResize(){
    // New Width and Height
    width = canvas.offsetWidth
    height = canvas.offsetHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
   
    // Aspect Ratio
    camera.aspect = width / height

    //Update Camera
    camera.updateProjectionMatrix()
}