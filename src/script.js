import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { NumberKeyframeTrack, PointLightHelper, Texture } from 'three'

//Loading
const textureLoader =  new THREE.TextureLoader()

//Loading mesh texture
const texture = textureLoader.load('/textures/texture.jpg')
const normTexture = textureLoader.load('/textures/normalMap.png')

// Debug
const gui = new dat.GUI()

//Axis display
const axesHelper = new THREE.AxesHelper( 10 );

/**
 * --------------------------------------------------------------------------
 * Canvas for Sphere
 * --------------------------------------------------------------------------
 */
const canvas = document.querySelector('canvas#sphere')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.IcosahedronGeometry( 0.4, 4);
const ringGeometry = new THREE.TorusGeometry(.6,0.05,9,40,6.3)

// Materials
const material = new THREE.MeshStandardMaterial()
material.metalness = .8
material.roughness = 0.9
material.texture = texture
material.normalMap = normTexture

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const ring = new THREE.Mesh(ringGeometry,material)
ring.rotation.x = 300
scene.add(sphere)
scene.add(ring)

// Lights
const pointLight = new THREE.PointLight(0xff0000, 0.1)
pointLight.position.set(-5, 4, -5)
pointLight.intensity = 15
scene.add(pointLight)

//Making folder to store gui elements, so this can be expanded or compressed in the browser independently
const light1 = gui.addFolder('light-1')
//Adding gui to control light
light1.add(pointLight.position, 'x').min(-5).max(5)
light1.add(pointLight.position, 'y').min(-5).max(5)
light1.add(pointLight.position, 'z').min(-5).max(5)
light1.add(pointLight, 'intensity').min(0).max(15)
const light1Color = {color: 0xff0000}
light1.addColor(light1Color, 'color')
.onChange(() => {
    pointLight.color.set(light1Color.color)
})

// Adding light helper
//const pLightHelper = new PointLightHelper(pointLight, 1)
//scene.add(pLightHelper)

const pointLight1 = new THREE.PointLight(0x0000ff, 0.1)
pointLight1.position.set(5, -5, -5)
pointLight1.intensity = 15
scene.add(pointLight1)

//Adding gui to control light
// gui.add(pointLight1.position, 'x').min(-5).max(5)
// gui.add(pointLight1.position, 'y').min(-5).max(5)
// gui.add(pointLight1.position, 'z').min(-5).max(5)
// gui.add(pointLight1, 'intensity').min(0).max(15)

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

    // Update renderers
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    panRenderer.setSize(sizes.width, sizes.height)
    panRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
 * --------------------------------------------------------------------------
 * Canvas for Panel
 * --------------------------------------------------------------------------
 */
const panCanvas = document.querySelector('canvas#panel')

// Scene
const panScene = new THREE.Scene()
//panScene.add( axesHelper );

// Objects
const panGeometry = new THREE.PlaneGeometry(1,1.5)

// Materials
const panMaterial = new THREE.MeshBasicMaterial()
panMaterial.color = new THREE.Color(0xf0ad4e)
panMaterial.side = 2

// Mesh
const panel = new THREE.Mesh(panGeometry,panMaterial)
panScene.add(panel)
panel.rotation.y = 0.5
panel.position.x = -.9

gui.add(panel.position,'x').min(-10).max(10).step(.1)
gui.add(panel.rotation,'y').min(0).max(360).step(.1)
gui.add(panel.rotation,'z').min(0).max(360)

/**
 * Camera
 */
// Base camera
const panCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
panCamera.position.x = 0
panCamera.position.y = 0
panCamera.position.z = 2
panScene.add(panCamera)

/**
 * Renderer
 */
const panRenderer = new THREE.WebGLRenderer({
    canvas: panCanvas,
})
panRenderer.setSize(sizes.width, sizes.height)
panRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    ring.rotation.z = -.3 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Renders
    renderer.render(scene, camera)
    panRenderer.render(panScene, panCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

 //Keyframes
const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ -0.8, 0, 0, 0.8, 0, 0, 0, 0, 0 ] );

// set up rotation about x axis
const yAxis = new THREE.Vector3( 0, 1, 0 );

const qInitial = new THREE.Quaternion().setFromAxisAngle( yAxis, 0.8 );
const qFinal = new THREE.Quaternion().setFromAxisAngle( yAxis, -0.8 );
const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );


//Animating keyframes
const clip = new THREE.AnimationClip('Spin', 1, [positionKF, quaternionKF])
const mixer = new THREE.AnimationMixer(panel)
const action = mixer.clipAction(clip)
action.setLoop(THREE.LoopOnce,1)
action.setDuration(.05)
action.clampWhenFinished = true

document.getElementById('btn').onclick = function(){
    document.getElementById('btn').style.display = "none"
    document.getElementById('txt').style.display = "initial"
    action.play()
    animate()
}

function animate() {
    requestAnimationFrame( animate )
    render()
}

function render() {
    const delta = clock.getDelta();
    if ( mixer ) {
        mixer.update( delta );
    }
    panRenderer.render( panScene, panCamera );
}