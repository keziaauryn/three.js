import * as THREE from './three/build/three.module.js'
import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js'
import {FBXLoader} from './three/examples/jsm/loaders/FBXLoader.js';
import {GUI} from './three/examples/jsm/libs/dat.gui.module.js'
import Stats from './three/examples/jsm/libs/stats.module.js';

//Member:
//Luis Sebastian Darkasih / 2201782473
//Kezia Auryn Lovenia Katili / 2201763120
//Vivian Fiana / 2201738983
//Rishka Anggraeni Liono / 2201794971
//Muhammad Rafi Getarpradhana / 2201818611

// variable yang ada
let scene, camera, renderer;
let plane;
let cube;
let saturn;
let nasaSatelite;
let gridHelp
let isGridded = false;
let isClicked = false;
let background;
let saturnRings = [ ];
let satelites = [ ], sateliteNames = [ ], sateliteDiameters = [ ], sateliteMass = [ ];
let controls;
let helper;
let spaceBar = false;
let xCam = 0, yCam = 7, zCam = 15;
let orbitRadCam = 4.5;
let timestaps = 1;
let text;
let text2;
let textPlanet;
let status;
let speedMove = 0.12;
let sateliteTimeLapse = 0;
let mouse 
let raycast 
let selectedObject
let haltMove = true;
let cameraRotate = true;
let detailGroup;


// Inisialisasi semua object //
let createSateliteProto = () =>{
    let loader = new FBXLoader();
    let sateliteTextureLoader = new THREE.TextureLoader().load('./texture/satelite/textures/satelite_texture.png');
    loader.load('./texture/satelite/source/satelite.fbx', function(fbx){
        fbx.castShadow = true;
        fbx.receiveShadow = true;
        fbx.rotateX(THREE.Math.degToRad(-90));
        fbx.scale.copy(new THREE.Vector3(0.005, 0.005, 0.005));
        fbx.traverse( function ( child ) {
            if (child.isMesh) child.material.map = sateliteTextureLoader;
        });
        nasaSatelite = fbx;
        nasaSatelite.position.copy(new THREE.Vector3(0, 2.5, 4));
        nasaSatelite.lookAt(0, 20, 0);
        nasaSatelite.userData.speed = 2;
        nasaSatelite.userData.rotateView = Math.PI * 0.03;
        scene.add(nasaSatelite);
    });
    loader.map = sateliteTextureLoader;
}

let createPlane = () => {
    let geometry = new THREE.PlaneGeometry(30, 2);
    let material = new THREE.MeshLambertMaterial({
        color: 0x000000,
        emissive: 0x000000,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -4
    mesh.position.x = 0
    mesh.rotation.x = 270
    mesh.rotation.y = 270
    return mesh;
}

let createSaturnRing = (wideRad, wideInner, colorCode) => { 
    let geometry = new THREE.RingBufferGeometry(wideRad, wideInner, 64);
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++){
        v3.fromBufferAttribute(pos, i);
        geometry.attributes.uv.setXY(i, v3.length() < 10 ? 0 : 1, 1);
    }
    let loader = new THREE.TextureLoader();
    let texture = loader.load('./texture/ring.jpg');
    let material = new THREE.MeshPhongMaterial({
        color: colorCode,
        side: THREE.DoubleSide,
        emissive: colorCode,
        emissiveIntensity: 0.2,
        shininess: 0.9,
        specular: 0xffffff,
        // transparent: true,
        wireframe: false,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow  = true;
    mesh.receiveShadow = true;
    mesh.position.y = 2.65;
    mesh.position.x = 0;
    mesh.geometry.verticesNeedUpdate = true;
    mesh.updateMatrixWorld();
    mesh.rotation.x = THREE.Math.degToRad(-90);
    mesh.rotation.y = THREE.Math.degToRad(5);
    // mesh.rotation.y = 0;
    return mesh;
}

let createSaturn = () => { 
    let geometry = new THREE.SphereGeometry(1, 32, 32, 6, 6.3, 0, 3.2);
    let loader = new THREE.TextureLoader();
    let texture = loader.load('./texture/saturn.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1,1);
    let material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0.1,
        specular: 0xffffff,
        wireframe: false,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 2.5
    mesh.position.x = 0;
    mesh.rotation.x = THREE.Math.degToRad(0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.name = "Saturn";
    let saturnRing1 = createSaturnRing(1.55, 1.67, 0x292723);
    let saturnRing2 = createSaturnRing(1.69, 1.71, 0xbdb3a4);
    let saturnRing3 = createSaturnRing(1.73, 1.98, 0xfffaf2);
    let saturnRing4 = createSaturnRing(1.99, 2.01, 0xffe5b5);
    let saturnRing5 = createSaturnRing(2.02, 2.05, 0x292723);
    let saturnRing6 = createSaturnRing(2.07, 2.08, 0x3d3a35);
    let saturnRing7 = createSaturnRing(2.083, 2.091, 0xfff5e6);
    let saturnRing8 = createSaturnRing(2.10, 2.13, 0x47443c);
    let saturnRing9 = createSaturnRing(2.15, 2.22, 0x2b2924);
    let saturnRing10 = createSaturnRing(2.24, 2.26, 0x3d3a35);
    let saturnRing11 = createSaturnRing(2.34, 2.35, 0x292723);
    saturnRings.push(saturnRing1);
    saturnRings.push(saturnRing2);
    saturnRings.push(saturnRing3);
    saturnRings.push(saturnRing4);
    saturnRings.push(saturnRing5);
    saturnRings.push(saturnRing6);
    saturnRings.push(saturnRing7);
    saturnRings.push(saturnRing8);
    saturnRings.push(saturnRing9);
    saturnRings.push(saturnRing10);
    saturnRings.push(saturnRing11);
    saturnRings.forEach(ring => {
        scene.add(ring);
    });
    return mesh;
}

let createSatelite = (name, diameter, mass, size, orbit, speed, colorCode, mapTexture) => {
    let geometry = new THREE.SphereGeometry(size, 32, 32, 6, 6.3, 0, 3.2 );
    let loader = new THREE.TextureLoader();
    let texture = loader.load(mapTexture);
    let material = new THREE.MeshPhongMaterial({
        color: colorCode,
        shininess: 0.5,
        specular: 0xffffff,
        wireframe: false,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.userData.orbit = orbit;
    mesh.userData.speed = speed;
    mesh.userData.name = name;
    mesh.userData.diameter = diameter;
    mesh.userData.mass = mass;
    mesh.userData.size = size;
    mesh.position.y = 2.5;
    mesh.castShadow  = true;
    mesh.receiveShadow = true;
    let sateliteOrbital = sateliteOrbit(orbit, mesh.position.y);

    let sateliteNameLoader = new THREE.FontLoader();
    sateliteNameLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
    , LoadedFont => {
        let textGeo = new THREE.TextGeometry(name, {
            font: LoadedFont,
            size: 0.3,
            height: 0.03
        });
        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0xcacbcc
        });
    
        text = new THREE.Mesh(textGeo, textMaterial);
        text.position.copy(mesh.position);
        text.position.y += 1.25;
        text.position.x += 0.2;
        sateliteNames.push(text);
        scene.add(text);
    });

    let sateliteDiameterLoader = new THREE.FontLoader();
    sateliteDiameterLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json"
    , LoadedFont => {
        let textGeo = new THREE.TextGeometry(diameter, {
            font: LoadedFont,
            size: 0.1,
            height: 0.02
        });
        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0xcacbcc
        });
    
        text = new THREE.Mesh(textGeo, textMaterial);
        text.position.copy(mesh.position);
        text.position.y += 1.05;
        text.position.x += 0.2;
        sateliteDiameters.push(text);
        scene.add(text);
    });
    
    let sateliteMassLoader = new THREE.FontLoader();
    sateliteMassLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json"
    , LoadedFont => {
        let textGeo = new THREE.TextGeometry(mass, {
            font: LoadedFont,
            size: 0.1,
            height: 0.02
        });
        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0xcacbcc
        });
    
        text = new THREE.Mesh(textGeo, textMaterial);
        text.position.copy(mesh.position);
        text.position.y += 1.25;
        text.position.x += 0.2;
        sateliteMass.push(text);
        scene.add(text);
    });
    return mesh;
}

let sateliteOrbit = (orbitOfPlanet, absPosY) => {
    let shape = new THREE.Shape();
    shape.moveTo(orbitOfPlanet, 0);
    shape.absarc(0, 0, orbitOfPlanet, 0, (2 * Math.PI), false);
    let spacedPoints = shape.createSpacedPointsGeometry(128);
    spacedPoints.rotateX(THREE.Math.degToRad(-90));
    let orbit = new THREE.Line(
        spacedPoints,
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        })
    );
    orbit.position.y = absPosY;
    scene.add(orbit);
}

let ambientLight = () => {
    let light = new THREE.AmbientLight(0xffffff);
    light.intensity = 0.1;
    return light;
}

let pointLight = () => {
    let light = new THREE.PointLight(0xffffff, 0.5);
    light.intensity = 0.2;
    light.position.y = 125;
    light.position.x = 125;
    // let helpLight = callHelper(light);
    scene.add(ambientLight());
    return light;
}

let directLight = () => {
    let light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(0,0,0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.position.y = 125;
    light.position.x = 125;
    // let helpLight = callHelper(light);
    scene.add(pointLight());
    return light;
}

let createSaturnDetail= () => {
    let loader = new THREE.FontLoader();

    let geometry = new THREE.PlaneGeometry( 4.2, 5, 32 );
    let material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry, material );
    plane.position.y += 3;
    plane.position.x -= 5;
    detailGroup = new THREE.Group();
    detailGroup.add( plane );

    loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json"
    , LoadedFont => {
        let textGeo9 = new THREE.TextGeometry("Did You Know?", {
            font: LoadedFont,
            size: 0.2,
            height: 0.05
        });
    
        let textMaterial9 = new THREE.MeshBasicMaterial({
            color: 0x3c7cd6
        });
        let text9 = new THREE.Mesh(textGeo9, textMaterial9);
        text9.position.y += 5;
        text9.position.x -= 6;
        detailGroup.add(text9);

        let textGeo0 = new THREE.TextGeometry("Saturn is the sixth planet from the Sun, the", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial0 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text0 = new THREE.Mesh(textGeo0, textMaterial0);
        text0.position.y += 4.5;
        text0.position.x -= 6.9;
        detailGroup.add(text0);

        let textGeo = new THREE.TextGeometry("second largest planet in our solar system.", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text = new THREE.Mesh(textGeo, textMaterial);
        text.position.y += 4.2;
        text.position.x -= 6.9;
        detailGroup.add(text);

        let textGeo1 = new THREE.TextGeometry("Saturn is unique among the planets.", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial1 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text1 = new THREE.Mesh(textGeo1, textMaterial1);
        text1.position.y += 3.7;
        text1.position.x -= 6.9;
        detailGroup.add(text1);

        let textGeo2 = new THREE.TextGeometry("It has a thousands of beautiful ringlets,", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial2 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text2 = new THREE.Mesh(textGeo2, textMaterial2);
        text2.position.y += 3.4;
        text2.position.x -= 6.9;
        detailGroup.add(text2);

        let textGeo3 = new THREE.TextGeometry("made of chunks of ice and rock.", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial3 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text3 = new THREE.Mesh(textGeo3, textMaterial3);
        text3.position.y += 3.1;
        text3.position.x -= 6.9;
        detailGroup.add(text3);

        let textGeo4 = new THREE.TextGeometry("Like fellow gas giant Jupiter, Saturn is a", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial4 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text4 = new THREE.Mesh(textGeo4, textMaterial4);
        text4.position.y += 2.6;
        text4.position.x -= 6.9;
        detailGroup.add(text4);

        let textGeo5 = new THREE.TextGeometry("ball made mostly of hydrogen and helium.", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial5 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text5 = new THREE.Mesh(textGeo5, textMaterial5);
        text5.position.y += 2.3;
        text5.position.x -= 6.9;
        detailGroup.add(text5);

        let textGeo6 = new THREE.TextGeometry("Saturn orbits the Sun once every 29.4", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial6 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text6 = new THREE.Mesh(textGeo6, textMaterial6);
        text6.position.y += 1.8;
        text6.position.x -= 6.9;
        detailGroup.add(text6);

        let textGeo7 = new THREE.TextGeometry("Earth years and distance of about ", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial7 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text7 = new THREE.Mesh(textGeo7, textMaterial7);
        text7.position.y += 1.5;
        text7.position.x -= 6.9;
        detailGroup.add(text7);

        let textGeo8 = new THREE.TextGeometry("1.4 billion kilometers from the Sun.", {
            font: LoadedFont,
            size: 0.15,
            height: 0.02
        });
    
        let textMaterial8 = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let text8 = new THREE.Mesh(textGeo8, textMaterial8);
        text8.position.y += 1.2;
        text8.position.x -= 6.9;
        detailGroup.add(text8);
    });
}

// buat scene, masukin object, dll //
let initiate = () => {
    scene = new THREE.Scene();
    let skyLoader = new THREE.CubeTextureLoader().setPath('/texture/skybox/').load(
        [
            'right.png',
            'left.png',
            'top.png',
            'bottom.png',
            'front.png',
            'back.png'
        ]
    );
    scene.background = skyLoader;
    camera = new THREE.PerspectiveCamera(
        60, 
        window.innerHeight/ window.innerHeight, 
        1, 
        1000
    );
    camera.position.set(xCam, yCam, zCam); // x y z
    camera.lookAt(0,0,0); // point camera at
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = true;
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let loader = new THREE.FontLoader();
    loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
    , LoadedFont => {
        let textGeo = new THREE.TextGeometry("Saturn", {
            font: LoadedFont,
            size: 0.3,
            height: 0.05
        });
    
        let textMaterial = new THREE.MeshBasicMaterial({
            color: 0xcacbcc
        });
    
        text = new THREE.Mesh(textGeo, textMaterial);
        text.position.y += 4.5;
        text.position.x -= 0.5;

        let textGeo2 = new THREE.TextGeometry("Planetary system of Saturn", {
            font: LoadedFont,
            size: 0.5,
            height: 0.05
        });
    
        let textMaterial2 = new THREE.MeshBasicMaterial({
            color: 0x3c7cd6
        });
        text2 = new THREE.Mesh(textGeo2, textMaterial2);
        text2.position.y += 6;
        text2.position.x -= 4.2;
        scene.add(text);
        scene.add(text2);
    });
    
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    createStatusTable();
    createSaturnDetail();

    // panggil  semua function buat bikin object geometry semua dibawah sini
    saturn = createSaturn();
    let mimas = createSatelite('Mimas','d = 396.4 km','m = 37493 x 10^15 kg', 0.27, 7.5, 0.14, 0x3232930, './texture/moon/mimas.png');
    let enceladus = createSatelite('Enceladus','d = 504.2 km','m = 108022 x 10^15 kg', 0.15, 10.5, 0.15, 0x242C6B, './texture/moon/enceladus.jpg');
    let tethys = createSatelite('Tethys','d = 1062.2 km','m = 617449 x 10^15 kg', 0.2, 12.5, 0.11, 0x737430, './texture/moon/tethys.jpg');
    let dione = createSatelite('Dione','d = 1122.8 km','m = 1095452 x 10^15 kg', 0.3, 17.5, 0.12, 0x303030, './texture/moon/dione.jpg');
    let rhea = createSatelite('Rhea','d = 1527.6 km','m = 2306518 x 10^15 kg', 0.23, 22.5, 0.08, 0x303030, './texture/moon/rhea.png');
    let titan = createSatelite('Titan','d = 5149.46 km','m = 134520000 x 10^15 kg', 0.5, 27.5, 0.05, 0xffffff, './texture/moon/titan.png');
    let lapetus = createSatelite('Lapetus', 'd = 1468.6 km','m = 1805635 x 10^15 kg',0.25, 30, 0.03, 0xd12313, './texture/moon/lapetus.jpg');
    let methone = createSatelite('Methone', 'd = 270.0 km','m = 5619.9 x 10^15 kg',0.18, 35, 0.085, 0x242C6B, './texture/moon/mimas.png');
    satelites.push(mimas);
    satelites.push(enceladus);
    satelites.push(tethys);
    satelites.push(dione);
    satelites.push(rhea);
    satelites.push(titan);
    satelites.push(lapetus);
    satelites.push(methone);
    plane = createPlane();
    let directLightScene = directLight();
    scene.add(directLightScene);
    scene.add(saturn);
    satelites.forEach(satelite => { 
        scene.add(satelite); 
    });
    createSateliteProto();
    controls.autoRotate = true;
    controls.autoRotateSpeed *= -0.25
    gridHelp = new THREE.GridHelper(8000, 1000, 100, 0x2B2B2B);
    gridHelp.receiveShadow = true;
    gridHelp.castShadow = true;
    addEventListener( 'wheel', onMouseDown, false );
    document.addEventListener( 'keydown', onKeyboardListenerDown, false);
    createGui();
}

// atur rotasi, speed dan control update
let animation = () => {
    status.begin();
    requestAnimationFrame(animation);
    saturn.rotation.y -= 0.0109;
    saturnRings.forEach(ring => {
        ring.rotation.z += 0.0155;
    });
    satelites.forEach(satelite => {   
        timestaps += 0.01;
        let orbit = satelite.userData.orbit;
        let speed = satelite.userData.speed;
        satelite.position.x = Math.cos(timestaps * speed) * orbit;
        satelite.position.z = Math.sin(timestaps * speed) * orbit;
        let loader = new THREE.FontLoader();
        satelite.rotation.y -= 0.0455;
        let i = satelites.indexOf(satelite);
        sateliteNames[i].position.copy(satelite.position);       
        sateliteNames[i].position.y += 0.8;
        sateliteNames[i].position.x -= (satelite.userData.size);
        sateliteNames[i].position.z -= (satelite.userData.size);
        sateliteDiameters[i].position.copy(satelite.position);       
        sateliteDiameters[i].position.y += 0.6;
        sateliteDiameters[i].position.x -= (satelite.userData.size);
        sateliteDiameters[i].position.z -= (satelite.userData.size);
        sateliteMass[i].position.copy(satelite.position);       
        sateliteMass[i].position.y += 0.4;
        sateliteMass[i].position.x -= (satelite.userData.size);
        sateliteMass[i].position.z -= (satelite.userData.size);
    });
    if(haltMove) reanimateSatelite(); // tambahin ini
    nasaSatelite.lookAt(0, 20, 0);
    moveCameraWithSatelite();
    controls.update();
    renderer.render(scene, camera);
    status.end();
}

let reanimateSatelite = () => { 
    sateliteTimeLapse -= speedMove/16;
    let speed = nasaSatelite.userData.speed;
    let dist = Math.sqrt(Math.pow(nasaSatelite.position.z, 2) + Math.pow(nasaSatelite.position.x, 2));  // rumus pythagoras
    nasaSatelite.position.z = Math.cos(sateliteTimeLapse * speed) * dist;
    nasaSatelite.position.x = Math.sin(sateliteTimeLapse * speed) * dist;
}

// memanggil function initiate dan animation
function start(){
    initiate()
    animation()
}

// Mouse dan Keyboard Listener //
let onMouseDown = (event) =>{
    console.log('mouse.')
    if(event.which == 1) {

    }
    // if(event.which == 3) {}   
}

//Saturn info
let mouseListener = (e) =>{

    raycast = new THREE.Raycaster()
    raycast.layers.set(1)
    saturn.layers.enable(1)

    mouse = {}
    let w = window.innerWidth
    let h = window.innerHeight
    mouse.x = e.clientX/w*2-1
    mouse.y = e.clientY/h*-2+1

    raycast.setFromCamera(mouse, camera)
    let items = raycast.intersectObjects(scene.children)

    items.forEach(i=>{
        console.log(i)
        selectedObject = i.object
        scene.add(createSaturnDetail(i.point))
    
    });

    console.log(`{Mouse X:${mouse.x}, Mouse Y:${mouse.y}}`)
}

let onKeyboardListenerDown = (event) =>{
    // event listener keyboard disini
    console.log('is pressed');
    if(event.key == "w" || event.key == "W") {
        nasaSatelite.position.z -= speedMove;
    }
    if(event.key == "a" || event.key == "A") {
        nasaSatelite.position.x -= speedMove;
    }
    if(event.key == "s" || event.key == "S") {
        nasaSatelite.position.z += speedMove;
    }
    if(event.key == "d" || event.key == "D") {
        nasaSatelite.position.x += speedMove;
    }
    if(event.key == "g" || event.key == "G"){
        diplayGrid();
    }
    if(event.key == "i" || event.key == "I"){
        detail();
    }
    if(event.key == ' '){
        switchView();
    }
}

function moveCameraWithSatelite(){
    if(spaceBar == true){
        camera = new THREE.PerspectiveCamera(
            60, 
            window.innerHeight/ window.innerHeight, 
            1, 
            1000
        );
        camera.position.copy(nasaSatelite.position);
        camera.lookAt(0, 2.5, 0);
        controls.target = nasaSatelite.position;
    }
}

let switchView = () =>{
    if(spaceBar == true){
        camera = new THREE.PerspectiveCamera(
            60, 
            window.innerHeight/ window.innerHeight, 
            1, 
            1000
        );
        camera.position.set(xCam, yCam, zCam);
        camera.lookAt(0,0,0);    
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed *= -0.25
        spaceBar = false;
    }else{
        camera = new THREE.PerspectiveCamera(
            60, 
            window.innerHeight/ window.innerHeight, 
            1, 
            1000
        );
        camera.position.copy(nasaSatelite.position);
        
        controls.target = nasaSatelite.position;
        controls.autoRotate = false;
        spaceBar = true;
    }
}

let diplayGrid = () =>{
    if(isGridded == false) {
        scene.add(gridHelp);
        isGridded = true;
    }
    else{
        scene.remove(gridHelp);
        isGridded = false;
    } 
}

let detail = () =>{
    if(isClicked == false) {
        scene.add(detailGroup);
        isClicked = true;
    }
    else{
        scene.remove(detailGroup);
        isClicked= false;
    } 
}

// tambahin
let freezeSatelite = () => {
    haltMove = (haltMove) ? false : true;
}


// rotasi kamera, tapi ga pake orbit control
let requestCamAnimation = () => {
    xCam += 0.0015;
    zCam += 0.0015;
    camera.position.set(
        Math.sin(xCam)*orbitRadCam, 
        yCam, 
        Math.cos(zCam)*orbitRadCam
    );
    camera.lookAt(0,2.5,0);
}

// setting up windows
window.onload = () => {
    start()
}

// setting up responsive windows preferences
window.onresize = () => {
    var newHeight = innerHeight;
    var newWidth = innerWidth;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth/newHeight;
    camera.updateProjectionMatrix();
}

let createStatusTable = () => {
    status = new Stats();
    status.showPanel(2);
    document.body.appendChild(status.dom);
}

let createGui = () => {
    let gui = new GUI();
    let viewController = gui
        .add(documentOption, 'switchViewChanger')
        .name('Satelite View [Space]')
        .listen()
        .onChange(function(){
            switchView();
        });
    let gridController = gui
        .add(documentOption, 'turnGrid')
        .name('Grid Floor [G]')
        .listen()
        .onChange(function(){ 
            diplayGrid();
        });
    let detailController = gui
        .add(documentOption, 'showDetail')
        .name('Saturn Info [I]')
        .listen()
        .onChange(function(){ 
            detail();
        });
    // tambahin
    let haltSateliteController = gui
        .add(documentOption, 'turnHaltSatelite')
        .name('Satelite Orbit')
        .listen()
        .onChange(function(){ 
            freezeSatelite();
        });
    let speedController = gui
        .add(documentOption, 'speedMove', 0.005, 0.5)
        .name('Satelite Speed Move')
        .listen()
        .onChange(function(val){ 
            speedMove = val;
        });
}

let documentOption = {
    switchViewChanger: false,
    turnGrid: isGridded,
    showDetail: isClicked,
    turnHaltSatelite: haltMove,
    speedMove: speedMove
}

// ====================================================== //
// let callHelper = (light) => {
//     helper = new THREE.CameraHelper( light.shadow.camera );
//     scene.add(helper);
// }

// let createCube = () => {
//     let geometry = new THREE.BoxGeometry(2, 2, 2);
//     let material = new THREE.MeshStandardMaterial({
//         color: 0xffffff,
//         roughness: 0.3,
//         metalness: 1
//     });
//     let mesh = new THREE.Mesh(geometry, material);
//     return mesh;
// }

// let createBackground = () => {
//     let geometry = new THREE.BoxGeometry(200, 200, 200);
//     let loader = new THREE.TextureLoader();
//     let texture = loader.load('./texture/sky-space.png');
//     let material = new THREE.MeshBasicMaterial({
//         // color: 0xffffff,
//         side: THREE.BackSide,
//         map: texture
//     });
//     let mesh = new THREE.Mesh(geometry, material);
//     return mesh;
// }

//===================================================================================//







