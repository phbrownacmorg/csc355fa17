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

function makeJack2(jack2Size) {
	// Make a jack by making three lines
	var jack2 = new THREE.Group();
	var origin = new THREE.Vector3(0, 0, 0);
	//var jack2Origin = new THREE.Vector3(-2, 0, 0);
	if (!jack2Size) {
		jack2Size = 1;
	}
	var jack2X = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), // dir
		                               origin, jack2Size, 0xff8800);
	var jack2Y = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), // dir
		                               origin, jack2Size, 0xff00ff);
	var jack2Z = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), // dir
		                               origin, jack2Size, 0x0000ff);
		               
	jack2.add(jack2X);
	jack2.add(jack2Y);
	jack2.add(jack2Z);
	//jack2.rotateY(jack2.rotation.y);
	//jack2.translateX(jack2Origin.x);
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
	// Instead of the cone and ice cream forming a hierarchy,
	// animating the ice cream is much easier if both cone and
	// ice cream are children of a reference frame that can
	// stay aligned with world space.
	var group = new THREE.Group();
	group.name = 'Ice cream cone';

	var geom = new THREE.ConeGeometry(1, 3, 32, 1, true);
	var bumps = new THREE.TextureLoader().load('images/waffle.jpg');
	bumps.wrapS = THREE.RepeatWrapping;
	var mat = new THREE.MeshPhongMaterial( { color: 0x8b4513,
																				   bumpMap: bumps });
	var cone = new THREE.Mesh(geom, mat);
	cone.rotation.z = Math.PI;

	group.add(cone);
	
	geom = new THREE.SphereGeometry(1, 256, 256);
	mat = new THREE.MeshPhongMaterial( { color: 0xf3e5ab,
																			 bumpMap: bumps,
																		 	 displacementMap: bumps,
																		   displacementScale: 0.1 });
	var ice_cream = new THREE.Mesh(geom, mat);
	ice_cream.name = 'ice cream';
	ice_cream.translateY(2);
	ice_cream.add(makeJack2(2));
	ice_cream.update = function(t) {
			// Need to save the start position in both world space
			// and object space
			if (!ice_cream.startPos) {
					ice_cream.startPos = ice_cream.position.clone();
					ice_cream.startPosWorld = ice_cream.getWorldPosition();
			}

			// Offset will be added to startPos to give the position
			var offset = ice_cream.target.getWorldPosition();
			// Initial value of offset is the vector from beginning to end.
			// Both positions have to be in the *same* space for the vector to be
			// coherent.  Both ends in world space (as here) gives a vector in 
			// world space.
			offset.sub(ice_cream.startPosWorld);
		
			// Movement happens from t == 0.1 to t == 1.
			offset.multiplyScalar(Math.max(0, (t - 0.1)/0.9));
			
			// Add more Y, to arch the track upwards
			var arcHeight = 3;
			offset.y += arcHeight * (1 - 4 * (t - 0.5) * (t - 0.5));

			// Set the ice cream's position to startPos plus offset
			ice_cream.position.addVectors(ice_cream.startPos, offset);
	}
	group.add(ice_cream);
	group.add(makeJack2(2));
	
	group.animating = true;
	group.update = function() {
			cone.rotation.y += 0.01;
			ice_cream.rotation.y += 0.01;
	}
	return group;
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

function makePumpkinTexture() {
    var tex = new THREE.TextureLoader().load('images/pumpkin-skin.png');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
}

function makeStem(r) {
		var mat = new THREE.MeshLambertMaterial( { color: 0x80461b, 
																								side: THREE.DoubleSide } );
		var stemR = r * 0.15;
		var stemHeight = 2 * stemR;
		var segs = 16;
		var cap = new THREE.Mesh(new THREE.CircleGeometry(stemR, segs), mat);
		cap.rotateX(-Math.PI/2);
		cap.translateZ(stemHeight * 0.5);
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(stemR, stemR, 
                                                         stemHeight, segs),
                              mat);
		stem.add(cap);
    stem.translateY(r);
    return stem;
}

function makePumpkinMaterial() {
    var pumpkinColor = 0xff7619;
    var mat = new THREE.MeshPhongMaterial( { color: pumpkinColor,
                                             map: makePumpkinTexture() } );
    return mat;
}

function makePumpkin(r) {
    var gourd;
    gourd = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32),
                               makePumpkinMaterial());
    gourd.add(makeStem(r));
    return gourd;
}

function makeGreatPumpkin(r) {
    var gourd = makePumpkin(r);
    // Put a face on this one
    gourd.material.map = new THREE.TextureLoader().load('images/pumpkin-face.png');
    
//     var nose = new THREE.Mesh(new THREE.SphereGeometry(r * .2, 32, 32),
//                               new THREE.MeshPhongMaterial({color:0xff0000})
//                              );
//     nose.translateZ(r);
//     gourd.add(nose);
 
		gourd.name = 'Great Pumpkin';
		gourd.animating = false;
		gourd.maxHeight = 3;
		
		gourd.start = function() {
			var riseTime = 7000;
			gourd.timer = new Timer(riseTime)
			gourd.initialY = gourd.position.y;
			//console.log('Started...')
		};
	
		gourd.update = function(t) {
			if (!t) { // Untimed animation
				gourd.position.y += 0.05;
			}
			else { // Timed animation
				gourd.position.y = gourd.initialY + 
														t * (gourd.maxHeight - gourd.initialY);
			}
			// Stop rising when y exceeds 3
			if (gourd.position.y > gourd.maxHeight) {
				gourd.animating = false;
				gourd.timer = undefined;
			}
		};
		
    return gourd;
}


function makeInsulator(h) {
	var r = h/10;
	var g = new THREE.CylinderGeometry(r, r, h);
	var tex = new THREE.TextureLoader().load('images/insulator-128x128.png');
	var m = new THREE.MeshStandardMaterial({
			color: 0x808080,
			metalness: 0,
			bumpMap: tex,
			displacementMap: tex,
			displacementScale: 0.05
	});
	var insulator = new THREE.Mesh(g, m);
	insulator.add(makeJack2(h));
	
	// Return the location of the insulator's top end in world space
	insulator.findTop = function() {
		var top = new THREE.Vector3(0, h/2, 0);
		top.add(insulator.position);
		return insulator.parent.localToWorld(top);
	};
	
	// Create a lightning bolt from the top of the insulator to
	// targetPt, which is in world space.
	var numJags = 30;
	insulator.lightningTo = function(targetPt, parent) {
			//console.log(insulator.findTop());
			//console.log(targetPt);
			var top = insulator.findTop();
			var line = new THREE.LineCurve3(top, targetPt);
			// Add jaggies
			var jagScale = (targetPt.distanceTo(top) / numJags) * 0.2;
			var pts = line.getPoints(numJags);
			// Leave the first and last points alone
			for (var i = 1; i < numJags - 1; i++) {
				var perturbation = new THREE.Vector3(Math.random() - 0.5,
																						Math.random() - 0.5,
																						Math.random() - 0.5);
				perturbation.multiplyScalar(2 * jagScale);
				pts[i].add(perturbation);
			}
			var sparkPath = new THREE.CatmullRomCurve3(pts); //, false, 'catmullrom', 100);
		
			var sparkGeom = new THREE.TubeGeometry(sparkPath, numJags, 0.02);
			var sparkMat = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				emissive: 0xffffff
			});
			var spark = new THREE.Mesh(sparkGeom, sparkMat);
			parent.add(spark);
	};
	
	return insulator;
}


function makeTransformer(h) {
	var r = h/3;
	var g = new THREE.CylinderGeometry(r, r, h);
	var m = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: 1.0,
		roughness: 0.9
	});
	var can = new THREE.Mesh(g, m);
	can.name = 'Zorchimus Deuce';
	
	var ins1 = makeInsulator(h/2);
	ins1.translateY(h/2 + h/4);
	ins1.translateX(r * 0.7);
	ins1.rotateZ(-Math.PI/15);
	can.add(ins1);
	
	var ins2 = makeInsulator(h/2);
	ins2.translateY(h/2 + h/4);
	ins2.translateX(-r * 0.7);
	ins2.rotateZ(Math.PI/15);
	can.add(ins2);
	
	can.zap = function(point, parent) {
			ins1.lightningTo(point, parent);
			ins2.lightningTo(point, parent);
	};
	
	//can.translateY(h/2);
	return can;
	
}
