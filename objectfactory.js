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


function setPickTarget(obj, target) {
		obj.pickTarget = target;
		for (var i = 0; i < obj.children.length; i++) {
				setPickTarget(obj.children[i], target);
		}
}

function makeHydrogenAtom(r) {
		var g = new THREE.SphereGeometry(r, 32, 32);
		var m = new THREE.MeshPhysicalMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.6,
				depthTest: false
		});
		var atom = new THREE.Mesh(g, m);
		return atom;
}

function makeH2() {
		var xDist = 0.3;
		var group = new THREE.Group();
		var h1 = makeHydrogenAtom(0.5);
		h1.translateX(xDist);
		var h2 = makeHydrogenAtom(0.5);
		h2.translateX(-xDist);
		group.add(h1);
		group.add(h2);
	
		group.name = 'H2';
		
		group.animating = true;
		group.dTheta = 0.01;
		group.update = function() {
			var maxTheta = Math.PI/6;
			group.rotation.y += group.dTheta;
			if (Math.abs(group.rotation.y) > maxTheta) {
					group.dTheta = -group.dTheta;
					group.rotation.y += 2 * group.dTheta;
			}
		};
	
		return group;
}

function makeSpheresGroup() {
		var group = new THREE.Group();
	
		var r = makeHydrogenAtom(0.5);
		r.material.color.set(0xff00ff);
	
		var g = makeHydrogenAtom(0.5);
		g.material.color.set(0x00ffff);
		g.material.blending = THREE.CustomBlending;
		g.material.srcBlend = THREE.ZeroFactor;
		g.material.dstBlend = THREE.OneFactor;
		g.translateY(0.3);
		g.translateX(0.3);
	
		var b = makeHydrogenAtom(0.5);
		b.material.color.set(0xffff00);
		b.translateY(0.3);
		b.translateX(-0.3);
	
		var bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
														new THREE.MeshBasicMaterial({
																color: 0xffffff,
																transparent: true
														}));
		bg.translateY(0.4);
		bg.translateX(0.3);
		bg.translateZ(-0.7);
	
		group.add(r);
		group.add(g);
		group.add(b);
		group.add(bg);
	
		group.name = 'Spheres';
		return group;
}

function makeSprites() {
		var g = new THREE.PlaneGeometry(0.375, 0.5);
	
		var offsets = new Array();
		var row1Width = 0.1067;
		for (var i = 0; i < 9; i++) {
			offsets.push(new THREE.Vector2(i * row1Width, 0.7176));
		}
	
		var tex = new THREE.TextureLoader().load('images/tiff_sheet_by_tedelf.png');
	  var alphaTex = new THREE.TextureLoader().load('images/gray_tedelf.png');
		alphaTex.wrapS = tex.wrapS = THREE.RepeatWrapping;
		alphaTex.wrapT = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(0.1067, 0.2824);
		alphaTex.repeat.copy(tex.repeat);
		tex.offset.copy(offsets[0]);
		alphaTex.offset.copy(tex.offset);
	
		var m = new THREE.MeshBasicMaterial({
			  alphaMap: alphaTex,
				color: 0xffffff,
				map: tex,
				transparent: true //,
			  //opacity: 1
		});
		var rect = new THREE.Mesh(g, m);
		rect.name = 'Female elfin';
		return rect;
}
