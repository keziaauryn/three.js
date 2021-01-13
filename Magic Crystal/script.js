import * as THREE from './three/build/three.module.js'

var camera, scene, renderer
let forest_left
let forest_right
let forest_floor
let obj_octahedron
let obj_cylinder
let obj_ring
let ambient
let point

let leftWall = () => {

    //Texture
    var loader = new THREE.TextureLoader()
    var texture1 = loader.load("assets/Forest_Left.png")

    // Left Wall
    let leftWallGeo = new THREE.PlaneGeometry(500, 500)
    let leftWallMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture1
    })
    let leftWallMesh = new THREE.Mesh(leftWallGeo, leftWallMaterial)
    leftWallMesh.position.set(175,250,175)
    leftWallMesh.receiveShadow = true

    return leftWallMesh
}

let rightWall = () => {

    //Texture
    var loader = new THREE.TextureLoader()
    var texture2 = loader.load("assets/Forest_Right.png")

    // Right Wall
    let rightWallGeo = new THREE.PlaneGeometry(500, 500)
    let rightWallMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture2
    })
    let rightWallMesh = new THREE.Mesh(rightWallGeo, rightWallMaterial)
    rightWallMesh.position.set(-175,250,175)
    rightWallMesh.receiveShadow = true

    return rightWallMesh 
}

let floor = () => {

    //Texture
    var loader = new THREE.TextureLoader()
    var texture3 = loader.load("assets/Forest_Floor.png")

    // Left Wall
    let floorGeo = new THREE.PlaneGeometry(500, 500)
    let floorMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture3
    })
    let floorMesh = new THREE.Mesh(floorGeo, floorMaterial)
    floorMesh.position.set(0,0,0)
    floorMesh.receiveShadow = true

    return floorMesh
}

let octahedron = () => {

    let octahedronGeo = new THREE.OctahedronGeometry(90,0)
    let octahedronMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        specular: 0xffffff,
        shininess: 3,
    })
    let octahedronMesh = new THREE.Mesh(octahedronGeo, octahedronMaterial)
    octahedronMesh.position.set(0,250,0)
    octahedronMesh.castShadow = true

    return octahedronMesh
}

let cylinder = () => {

    let cylinderGeo = new THREE.CylinderGeometry(40, 100, 100, 8)
    let cylinderMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0c0c0
    })
    let cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMaterial)
    cylinderMesh.position.set(0,50,0)
    cylinderMesh.castShadow = true

    return cylinderMesh
}

let ring = () => {

    let ringGeo = new THREE.RingGeometry(150, 130, 32)
    let ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xc3498db,
        side: THREE.DoubleSide
    })
    let ringMesh = new THREE.Mesh(ringGeo, ringMaterial)
    ringMesh.position.set(0,250,0)
    ringMesh.castShadow = true

    return ringMesh
}


let ambientLight = () => {
    let light = new THREE.AmbientLight(0xffffff)
    light.intensity = 0.6
    return light
}

let pointLight = () => {
    let light = new THREE.PointLight(0xffffff)
    light.intensity = 0.7
    light.distance = 1000
    light.position.set(0,300,-300)
    light.shadow.camera.far = 700
    light.castShadow = true
    return light
}

let init = () => {
    scene = new THREE.Scene()

    // Field of View
    let fov = 100
    let width = window.innerWidth
    let height = window.innerHeight
    let aspect = width/height
    let near = 0.1
    let far = 10000

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 500 ,-550)
    camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer()
    renderer.antialias = true
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x87ceeb)
    renderer.shadowMap.type = THREE.BasicShadowMap

    document.body.appendChild(renderer.domElement)

    forest_left = leftWall()
    forest_right = rightWall()
    forest_floor = floor()
    obj_octahedron = octahedron()
    obj_cylinder = cylinder()
    obj_ring = ring()
    ambient = ambientLight()
    point = pointLight()

    let objects = [
        forest_left,
        forest_right,
        forest_floor,
        obj_octahedron,
        obj_cylinder,
        obj_ring,
        ambient,
        point
    ]

    objects.forEach(object => {
        scene.add(object)
    });
}

let rendering = () => {
    renderer.render(scene, camera)

    //Rotation
    forest_left.rotation.y = Math.PI /4
    forest_right.rotation.y = -Math.PI /4
    forest_floor.rotation.x = Math.PI /2
    forest_floor.rotation.z = -Math.PI /4
    obj_ring.rotation.x = Math.PI /2

    requestAnimationFrame(rendering) 
}

window.onload = () => {
    init()
    rendering()
}

window.onresize = () => {
    let newW = innerWidth
    let newH = innerHeight

    renderer.setSize(newW, newH)

    camera.aspect = newW/newH
    camera.updateProjectionMatrix()
}