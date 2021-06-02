import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLightHelper, Texture } from 'three'

//Loading
const textureLoader =  new THREE.TextureLoader()

//Loading mesh texture
const texture = textureLoader.load('/textures/texture.png')
const normTexture = textureLoader.load('/textures/normalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.IcosahedronGeometry( 0.9, 4);

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = .8
material.roughness = 0.9
material.texture = texture
material.normalMap = normTexture

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights
const pointLight = new THREE.PointLight(0xff0000, 0.1)
pointLight.position.x = -5
pointLight.position.y = .2
pointLight.position.z = -5
pointLight.intensity = 2.1
scene.add(pointLight)

//Adding gui to control light
gui.add(pointLight.position, 'x').min(-5).max(5)
gui.add(pointLight.position, 'y').min(-5).max(5)
gui.add(pointLight.position, 'z').min(-5).max(5)
gui.add(pointLight, 'intensity').min(0).max(15)

// Adding light helper
//const pLightHelper = new PointLightHelper(pointLight, 1)
//scene.add(pLightHelper)

const pointLight1 = new THREE.PointLight(0x0000ff, 0.1)
pointLight1.position.x = 5
pointLight1.position.y = -0.7
pointLight1.position.z = -1.9
pointLight1.intensity = 2.1
scene.add(pointLight1)

//Adding gui to control light
gui.add(pointLight1.position, 'x').min(-5).max(5)
gui.add(pointLight1.position, 'y').min(-5).max(5)
gui.add(pointLight1.position, 'z').min(-5).max(5)
gui.add(pointLight1, 'intensity').min(0).max(15)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()