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
	ptLight.add(lightBall);
	ptLight.name = "Light";
	ptLight.t = 0;
	ptLight.dt = 0.01;
	ptLight.update = function() {
		if (!ptLight.startPos) {
			ptLight.startPos = ptLight.position.clone();
		}
		var dx = 5;
		var dy = 1.5;
		ptLight.position.y = ptLight.startPos.y + dy - (4 * Math.pow(ptLight.t - 0.5, 2));
		ptLight.position.x = ptLight.startPos.x + dx * ptLight.t;
	};
	
	
	//lightBall.position.copy(ptLight.position);
	//scene.add(lightBall);
	
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
	var ground = makeBgPlane(0x00dd00); //, 'images/checkerboard4.png');
	//var tex = ground.material.map;
	//tex.wrapS = THREE.RepeatWrapping;
    //tex.wrapT = THREE.RepeatWrapping;
    //tex.repeat.set(128,128);
	ground.rotateX(-Math.PI / 2);
	ground.translateZ( -10 );
	scene.add(ground);
	
	var steve = makeSteve();
	//steve.scale.set(0.5, 0.5, 0.5);
	//steve.translateZ(-768);
	steve.translateX(-4);
	setPickTarget(steve, steve);
	//steve.translateY(246);
	scene.add( steve );
	
	var ignatz = makeIgnatz();
	ignatz.translateY(1);
	ignatz.translateZ(-6);
	ignatz.translateX(2);
	setPickTarget(ignatz, ignatz);
	ignatz.jumping = false;
	scene.add( ignatz );
	
	var cone = makeCone();
	cone.translateZ(-20);
	cone.translateX(7);
	setPickTarget(cone, cone);
	cone.rotating = true;
	scene.add(cone);
	
	// Turn on the lights
	addLights(scene);

	// Add a camera to see it
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight,
		0.1, 1000 );
	camera.position.z = 5;
	camera.position.x = -1;
	camera.position.y = 1;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('three-js-div')
			.insertBefore(renderer.domElement,
									  document.getElementById('help-form'));
	
	attachHandlers(camera, scene.children);
	var animatables = scene.children.filter(function(obj) {
																						return obj.name;
																					});
	console.log(animatables.length + ' animatable objects');
			
	function animate() {
		requestAnimationFrame(animate);
		animatables.forEach(function(obj) {
			if (obj.animating) {
					obj.update();
			}
		})
		
// 		if (cone.rotating) {
// 			cone.rotation.y += 0.01;
// 		}
// 		if (ignatz.jumping) {
// 				updateIgnatz(ignatz);
// 		}
		renderer.render(scene, camera);
	}
	animate();
}

makeWorld();
