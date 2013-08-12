
// texture

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );

};

var texture = new THREE.Texture();

var loader = new THREE.ImageLoader( manager );
loader.load( 'textures/ash_uvgrid01.jpg', function ( image ) {

    texture.image = image;
    texture.needsUpdate = true;

} );

// model

var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/male02/male02.obj', function ( object ) {

    object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

            child.material.map = texture;

        }

    } );

    object.position.y = - 80;
    scene.add( object );

} );

// texture

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );

};

var texture = new THREE.Texture();

var loader = new THREE.ImageLoader( manager );
loader.load( 'textures/ash_uvgrid01.jpg', function ( image ) {

    texture.image = image;
    texture.needsUpdate = true;

} );

// model

var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/male02/male02.obj', function ( object ) {

    object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

            child.material.map = texture;

        }

    } );

    object.position.y = - 80;
    scene.add( object );

} );
