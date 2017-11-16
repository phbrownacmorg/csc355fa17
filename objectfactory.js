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

