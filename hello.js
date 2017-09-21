function addLights(scene) {
	var dirLight = new THREE.DirectionalLight();
	dirLight.position.set(1, 1, 3);
	scene.add(dirLight);
	
	var ptLight = new THREE.PointLight(0xffffff, 0.7, 0, 2);
	ptLight.position.set(-4, 2, 0);
	scene.add(ptLight);
	// Add a ball to make it visible
	var lightBall = new THREE.Mesh(
		new THREE.SphereGeometry(0.1),
		new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.BackSide }));
	lightBall.position.copy(ptLight.position);
	scene.add(lightBall);
	
	var ambLt = new THREE.AmbientLight(0x00dd00, 0.05);
	scene.add(ambLt);
}

function makeWorld() {
	/* global THREE */
	// Make the scene
	var scene = new THREE.Scene();
	
	// Add background planes
	var sky = makeBgPlane(0x8888ff, 'images/clouds-clipped.jpg');
	sky.translateZ( -900 );
	//sky.material.map = THREE.
	scene.add(sky);
	var ground = makeBgPlane(0x00dd00, 'images/checkerboard4.png');
	var tex = ground.material.map;
	tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(128,128);
	ground.rotateX(-Math.PI / 2);
	ground.translateZ( -10 );
	scene.add(ground);
	
	var steve = makeSteve();
	//steve.scale.set(0.5, 0.5, 0.5);
	//steve.translateZ(-768);
	steve.translateX(-4);
	//steve.translateY(246);
	scene.add( steve );
	
	var ignatz = makeIgnatz();
	ignatz.translateY(1);
	scene.add( ignatz );
	
	var cone = makeCone();
	cone.translateZ(-2);
	cone.translateX(3);
	scene.add(cone);
	
	//var text = makeText('Hello, Ignatz!');
	//text.scale.x *= 100;
	//text.scale.y *= 100;
	//scene.add(text);
	
	// Make a jack with the AxisHelper
	var jack1 = new THREE.AxisHelper(2);
	scene.add(jack1);
	
	// Make a jack using a hierarchy of arrows
	var jack2 = makeJack2();
	scene.add(jack2);							

	// Turn on the lights
	addLights(scene);

	// Add a camera to see it
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight,
		0.1, 1000 );
	camera.position.z = 5;
	camera.position.x = -1;
	camera.position.y = 1;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.getElementById('three-js-div').appendChild( renderer.domElement );

	function animate() {
		requestAnimationFrame( animate );
		cone.rotation.y += 0.01;
		//ignatz.rotation.y += 0.01;
		//jack2.rotation.y -= 0.01;
		//steve.rotation.y += 0.01;
		// text.rotation.x += 0.01;
		// text.rotation.y += 0.01;
		// text.rotation.z += 0.01;
		renderer.render( scene, camera );
	}
	animate();
}

makeWorld();
