// JavaScript File
/* global THREE */

function makeBgPlane(hexcolor, url) {
    var geom = new THREE.PlaneGeometry(2048, 2048, 1, 1);
    var mat;
    if (url !== undefined) {
    	var tex = new THREE.TextureLoader().load(url);
    	mat = new THREE.MeshLambertMaterial( { map: tex });
    }
    else {
    	mat = new THREE.MeshLambertMaterial( { color: hexcolor } );
    }
    var plane = new THREE.Mesh(geom, mat);
    return plane;
}

function makeJack2() {
	// Make a jack by making three lines
	var jack2 = new THREE.Group();
	var origin = new THREE.Vector3(0, 0, 0);
	var jack2Origin = new THREE.Vector3(-2, 0, 0);
	var jack2Size = 1;
	var jack2X = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), // dir
		                               origin, jack2Size, 0xff8800);
	var jack2Y = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), // dir
		                               origin, jack2Size, 0xff00ff);
	var jack2Z = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), // dir
		                               origin, jack2Size, 0x0000ff);
		               
	jack2.add(jack2X);
	jack2.add(jack2Y);
	jack2.add(jack2Z);
	jack2.rotateY(jack2.rotation.y);
	jack2.translateX(jack2Origin.x);
	return jack2;
}

function makeShoe(xDir) {
	var shoeRadius = 0.25;
	var wSegs = 32;
	var geometry = new THREE.SphereGeometry(shoeRadius, 
	            wSegs, wSegs/2, 
				0, Math.PI);
	var material = new THREE.MeshBasicMaterial( { color: 0x000000,
																							 side: THREE.DoubleSide
																							} );
	var shoe = new THREE.Mesh( geometry, material );
	var sole = new THREE.Mesh(new THREE.CircleGeometry(shoeRadius,
	                                                   wSegs),
	                          material);
	shoe.add(sole);
	shoe.scale.y = 1 / shoeRadius;
	shoe.rotateX(-Math.PI / 2);
	shoe.translateZ( -1 );
	shoe.translateX(xDir * .5);
	shoe.translateY(-.3);
	return shoe;
}

function makeIgnatz() {
	var geometry = new THREE.SphereGeometry(1, 32, 16);
	var tex = new THREE.TextureLoader().load('images/1024px-Smiley-stretch-2.png');
	//tex.offset.set(0.05, 0);
	tex.repeat.set(2, 1);
	var material = new THREE.MeshPhongMaterial( { color: 0xffff00,
																							map: tex });
	var ignatz = new THREE.Mesh( geometry, material );
	ignatz.add(makeShoe(-1));
	ignatz.add(makeShoe(1));
	
	return ignatz;
}

function makeSteve() {
    var geometry = new THREE.BoxGeometry( 0.5, 0.75, 1 );
    var materials = [
    	new THREE.MeshLambertMaterial({
    			map: new THREE.TextureLoader().load('images/steve-face.png')
    		}),
    	new THREE.MeshLambertMaterial({
    			map: new THREE.TextureLoader().load('images/steve-head-back.png')
    		}),
    	new THREE.MeshLambertMaterial({
    			map: new THREE.TextureLoader().load('images/steve-top.png')
    		}),
    	new THREE.MeshLambertMaterial({
    			color: 0x000000
    		}),
    	new THREE.MeshLambertMaterial({
    			map: new THREE.TextureLoader().load('images/steve-r-side.png')
    		}),
    	new THREE.MeshLambertMaterial({
    			map: new THREE.TextureLoader().load('images/steve-l-side.png')
    		}),
    	];
    var steve = new THREE.Mesh(geometry, materials);
    return steve;
}

function makeCone() {
	var bumps = new THREE.TextureLoader().load('images/Hermann-grid-256.png');
	bumps.wrapS = THREE.RepeatWrapping;
	bumps.wrapT = THREE.RepeatWrapping;
	bumps.repeat.set(4, 4);
	var geom = new THREE.ConeGeometry(1, 3, 32, 1, true);
	var mat = new THREE.MeshPhongMaterial( { color: 0x8b4513, bumpMap: bumps });
	var cone = new THREE.Mesh(geom, mat);
	var ball = new THREE.Mesh(new THREE.SphereGeometry(1, 256, 256),
	                           new THREE.MeshPhongMaterial( { color: 0xd2691e, 
	                                                          displacementMap: bumps,
	                                                          displacementScale: 0.15 }));
	ball.translateY(-2.1);
    cone.add(ball);
	cone.rotation.z = Math.PI;
	return cone;
}


function makeText(msg) {
	// Font-loading is *not* being handled intelligently here.
	// There *should* be a way to re-use the loader and any
	// previously-loaded fonts.
	var loader = new THREE.FontLoader();
	var geometry;
	var textMesh;
	loader.load( 'three.js-master/examples/fonts/helvetiker_regular.typeface.json', 
		function ( font ) {
			var geometry = new THREE.TextGeometry( msg, {
				font: font,
				size: 80,
				height: 20,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelSegments: 5
			} );
		var material = new THREE.MeshBasicMaterial( { color: 0x000088 } );
		textMesh = new THREE.Mesh(geometry, material);
		} );
	return textMesh;
}
