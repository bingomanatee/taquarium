if (!Detector.webgl) Detector.addGetWebGLMessage();

var SCALE = 1;
var MARGIN = 100;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var AL_HEIGHT = 50;
var AL_WIDTH = 100;

var NEAR = 1.0, FAR = 350.0;
var VIEW_ANGLE = 30;

// controls

var mouseX = 0;
var mouseY = 0;

var targetX = 0, targetY = 0;
var angle = 0;
var target = new THREE.Vector3(0, 0, 0);

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// core

var renderer, camera, scene, stats, clock;

// lights

var spotlights = [];
//

var video;
var morph;
var tacos = [];

//

init();
animate();

// -----------------------------

function init() {

    // camera

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR);
    camera.position.y = 10;

    // scene

    scene = new THREE.Scene();
    scene.add(camera);

    // video

    video = document.getElementById('video');
    //video.volume = 0;

    water_texture = new THREE.Texture(video);
    water_texture.wrapS = water_texture.wrapT = THREE.MirroredRepeatWrapping;
    water_texture.anisotropy = 4;
    water_texture.repeat = new THREE.Vector2(12, 12);
    water_texture.format = THREE.RGBFormat;

    // renderer

    renderer = new THREE.WebGLRenderer({ width: WIDTH, height: HEIGHT, antialias: true});

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.bottom = 0;
    renderer.domElement.style.left = 0;

    document.body.appendChild(renderer.domElement);
    $(renderer.domElement).width('100%').height('100%');

    // effects

    //var bloomEffect = new THREE.BloomPass( 0.65 );
    //renderer.addEffect( bloomEffect );

    // stats

    // clock

    clock = new THREE.Clock();

    // add lights

    initLights();

    // add objects

    initObjects();

    // events

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

}

// -----------------------------


function initLights() {
    for (var x = -80; x <= 80; x += 40) for (var z = -160; z <= 160; z += 40) {
        var spot = new THREE.SpotLight(
            new THREE.Color(Math.random() / 2, Math.random(), 0.25 + Math.sqrt(Math.random())),
            Math.max(0, Math.random() / 2), 0, Math.PI / 6);

        spot.position.set(x, 20, z);
        spot.rotation.set(Math.PI / 2, 0, 0);
        spot.castShadow = true;
    //    spot.target = new THREE.Object3D();
        spotlights.push(spot);
        scene.add(spot);
    }
}

// -----------------------------

function initObjects() {

    // floor

    var floorMap = THREE.ImageUtils.loadTexture("obj/lightmap/stone.jpg");
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
    floorMap.repeat.set(8, 8);
    floorMap.anisotropy = 4;

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshPhongMaterial(
        { color: 0x222222, specular: 0xffffff, bumpMap: floorMap, bumpScale: 0.05 }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -5;
    scene.add(plane);
    /*
     // morph

     var loader = new THREE.JSONLoader();
     loader.load( "models/animated/sittingBox2.js", function( geometry ) {

     var morphMaterial = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0xffffff, shininess: 50, morphTargets: true, morphNormals: true, side: THREE.DoubleSide } );
     morphMaterial.shading = THREE.FlatShading;

     geometry.computeMorphNormals();
     morph = new THREE.MorphAnimMesh( geometry, morphMaterial );

     var s = 10;
     morph.scale.set( s, s, s );
     morph.rotation.y = Math.PI;

     morph.duration = 8000;
     morph.mirroredLoop = true;

     morph.castShadow = true;
     morph.receiveShadow = true;

     scene.add( morph );

     } ); */

    // texture

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    function onLoad(event) {
// do something
        texture.image = event.image;
        texture.needsUpdate = true;
    }

    function onError(event) {
// do something
    }

    texture = THREE.ImageUtils.loadTexture('/Taco/obj/taco_texture.jpg', {}, onLoad, onError)

    var loader = new THREE.ImageLoader(manager);
    /*      loader.load('/Taco/obj/taco_texture.jpg', function (image) {


     });*/


    // model

    var loader2 = new THREE.OBJLoader(manager);
    loader2.load('/Taco/obj/taco_smooth.obj', function (obj) {

    for (var inc = 0; inc < 4; ++inc) {
            console.log('taco loaded');
        var taco;
        taco = obj.clone();
        taco.add(obj);
        taco.position.x = 40;
        taco.position.y = 0 - 2 * inc;
        taco.position.z = 10 + inc * 5;
        taco.rotation.y = Math.PI / 8;
        taco.scale.set(10, 10, 10);

        taco.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                console.log('child material', child.material);
                console.log('child geometry', child.geometry);

                child.material.map = texture;
                child.material.envMap = water_texture;
                child.material.specularMap = water_texture;
                child.material.specularity = 0.5
                child.material.combine = THREE.MixOperation;
                child.material.reflectivity = 0.3

                child.material.needsUpdate = true;
                child.castShadow = true;
                child.material.shading = THREE.SmoothShading;

            }

            if (child.castShadow){
                child.castShadoe = true;
            }

        });

        console.log(taco);

          if (inc == 0)  for (var j = 0; j < spotlights.length; ++j)spotlights[j].target.position = taco.position.clone();
            scene.add(taco);
            tacos.push(taco);

    }
        });


}


// -----------------------------

function onWindowResize(event) {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}

function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX ) * 1;
    mouseY = ( event.clientY - windowHalfY ) * 1;

}

// -----------------------------

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    // update video texture

    if (video.readyState === video.HAVE_ENOUGH_DATA && water_texture) water_texture.needsUpdate = true;

    // update camera

    var delta = clock.getDelta();

    targetX = mouseX * .002;
    targetY = mouseY * .001;

    angle += 0.025 * ( targetX - angle );

    camera.position.x = -Math.sin(angle) * 40;
    camera.position.z = -Math.cos(angle) * 40;

    var i = Math.floor(Math.random() * spotlights.length);

    var light = spotlights[i];

    light.intensity = Math.min(0.25, Math.max(0.01, light.intensity + (Math.random() - 0.5) / 4));

    for (var t = 0; t < tacos.length; ++t){
        tacos[t].position.x -= Math.random() / 10;
    }

    camera.lookAt(target);

    // update morph

    // if (morph) morph.updateAnimation(delta * 1000);

    // render

    renderer.render(scene, camera);

}

setTimeout(onWindowResize, 1000);