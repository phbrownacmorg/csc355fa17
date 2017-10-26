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
	var material = new THREE.MeshLambertMaterial( { color: 0x000000,
																							 side: THREE.DoubleSide
																							} );
	// Clone the material to avoid aliasing
	var shoe = new THREE.Mesh( geometry, material.clone() );
	var sole = new THREE.Mesh(new THREE.CircleGeometry(shoeRadius,
	                                                   wSegs),
	                          material.clone());
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
	
	ignatz.name = 'Ignatz';
	
	ignatz.animating = false;
	ignatz.originalColor = ignatz.material.color.getStyle();
	ignatz.t = 0;
	
	ignatz.update = function() {
		var dt = 0.01;
		var dz = 2;
		ignatz.t += dt;
		if (ignatz.t >= 1) {  // Not cyclic
				ignatz.t = 0;
				ignatz.animating = false;
				ignatz.material.color.set(ignatz.originalColor);
				ignatz.rotation.y = 0;
		}
		else if (ignatz.material.color) {
				var g = Math.round(ignatz.t * 255);
				ignatz.material.color.set('rgb(0,' + g.toString() + ',0)');
		}
	
		if (ignatz.t < 0.1) {
				ignatz.rotation.y = -(Math.PI/2) * (ignatz.t/0.1);
		}
		else if (ignatz.t < 0.9) {
				ignatz.translateZ(dz / (0.8 / dt));
				ignatz.position.y = 1 + Math.sin(Math.PI * ((ignatz.t - 0.1)/0.8));
		}
		else if (ignatz.t >= 0.9) {
			  ignatz.rotation.y = -(Math.PI/2) * ((1 - ignatz.t)/0.1);
		}		
	}
	
	return ignatz;
}

function makeSteve() {
    var geometry = new THREE.BoxGeometry( 0.5, 0.75, 1 );
    var materials = [
    	new THREE.MeshLambertMaterial({
					color: 0xffffff,
    			map: new THREE.TextureLoader().load('images/steve-face.png')
    		}),
    	new THREE.MeshLambertMaterial({
					color: 0xffffff,
    			map: new THREE.TextureLoader().load('images/steve-head-back.png')
    		}),
    	new THREE.MeshLambertMaterial({
					color: 0xffffff,
    			map: new THREE.TextureLoader().load('images/steve-top.png')
    		}),
    	new THREE.MeshLambertMaterial({
    			color: 0x000000
    		}),
    	new THREE.MeshLambertMaterial({
					color: 0xffffff,
    			map: new THREE.TextureLoader().load('images/steve-r-side.png')
    		}),
    	new THREE.MeshLambertMaterial({
					color: 0xffffff,
    			map: new THREE.TextureLoader().load('images/steve-l-side.png')
    		}),
    	];
    var steve = new THREE.Mesh(geometry, materials);
		steve.name = 'Steve';
		steve.animating = false;
		steve.t = 0;
		steve.dt = 0.01;
		steve.update = function() {
				// Update t
				steve.t += steve.dt;
				if (steve.t > 1 || steve.t < 0) { // Cyclic t
					steve.dt = -steve.dt;
					steve.t += 2 * steve.dt;
				}
			
				// Make Steve bounce as a function of t
				if (!steve.startPos) { // Record the initial position
					steve.startPos = steve.position.clone();
				}
				// Linear motion looks strange at the ends
				//steve.position.y = steve.startPos.y + 2 * steve.t;
				steve.position.y = steve.startPos.y + 2 * Math.sin(steve.t * Math.PI / 2);
		}
    return steve;
}

function makeCone() {
	var geom = new THREE.ConeGeometry(1, 3, 32, 1, true);
	var bumps = new THREE.TextureLoader().load('images/waffle.jpg');
	bumps.wrapS = THREE.RepeatWrapping;
	var mat = new THREE.MeshPhongMaterial( { color: 0x8b4513,
																				   bumpMap: bumps });
	var cone = new THREE.Mesh(geom, mat);
	
	geom = new THREE.SphereGeometry(1, 256, 256);
	mat = new THREE.MeshPhongMaterial( { color: 0xf3e5ab,
																			 bumpMap: bumps,
																		 	 displacementMap: bumps,
																		   displacementScale: 0.2 });
	var ice_cream = new THREE.Mesh(geom, mat);
	ice_cream.translateY(-2);
	cone.add(ice_cream);
	cone.rotation.z = Math.PI;
	cone.name = 'Ice cream cone';
	
	cone.animating = true;
	cone.update = function() {
			cone.rotation.y += 0.01;
	}
	return cone;
}

function setPickTarget(obj, target) {
		obj.pickTarget = target;
		for (var i = 0; i < obj.children.length; i++) {
				setPickTarget(obj.children[i], target);
		}
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
