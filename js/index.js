// Source: https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/
// Importing from Web
// import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
// import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

// Importing from local files
import * as THREE from '../lib/three/build/three.module.js'
import { OrbitControls } from '../lib/three/examples/jsm/controls/OrbitControls.js'
import { MeshSurfaceSampler } from './MeshSurfaceSampler.js'
import { OBJLoader } from './OBJLoader.js'

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
const camera = new THREE.PerspectiveCamera(75, width / height, .1, 1000)
// Set the position of camera
camera.position.set(0, 120, 300) // HERE
// Look at Center of Screen
// camera.lookAt(0, 0, 0)

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


let sampler = null;
let paths = [];
// Load in OBJ File
new OBJLoader().load(
  "../img/Lamborghini_Aventador.obj",
  (obj) => { 
    sampler = new MeshSurfaceSampler(obj.children[0]).build();
    
    for (let i = 0;i < 4; i++) {
      const path = new Path(i);
      paths.push(path);
      group.add(path.line);
    }
    
    renderer.setAnimationLoop(render);
  },
//   (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
//   (err) => {
//     console.log('oops');
//     console.error(err)
//   }
);

const tempPosition = new THREE.Vector3();

// Choose colors of the object lines
const materials = [new THREE.LineBasicMaterial({color: 0xA51C30, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0x897E60, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0x0078ff, transparent: true, opacity: 0.5}),
new THREE.LineBasicMaterial({color: 0xE67300, transparent: true, opacity: 0.5})];

// Construct a path from the mesh
class Path {
  constructor (index) {
    this.geometry = new THREE.BufferGeometry();
    this.material = materials[index % 4];
    this.line = new THREE.Line(this.geometry, this.material);
    this.vertices = [];
    
    sampler.sample(tempPosition);
    this.previousPoint = tempPosition.clone();
  }
  update () {
    let pointFound = false;
    while (!pointFound) {
      sampler.sample(tempPosition);
      if (tempPosition.distanceTo(this.previousPoint) < 30) {
        this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
        this.previousPoint = tempPosition.clone();
        pointFound = true;
      }
    }
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));
  }
}

// Position of the Object
group.position.z +=100 
group.position.x +=50

// Render function
// function render(a) {
//     // Rotate Object at each step
//     group.rotation.y += 0.002;
    
//     paths.forEach(path => {
//       if (path.vertices.length < 10000) {
//         path.update();
//       }
//     });
  
//     renderer.render(scene, camera);
//   }
let lastRenderTime = Date.now();
function render() {
    requestAnimationFrame(render);
    const now = Date.now();
    const delta = now - lastRenderTime;
    
    if (delta > 50) {
        group.rotation.y += 0.002;
        paths.forEach(path => {
            if (path.vertices.length < 10000) {
                path.update();
            }
        });
        renderer.render(scene, camera);
        lastRenderTime = now;
    }
}

// // Resize Window Event Listener
window.addEventListener('resize', onResize)

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



