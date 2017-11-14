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
		ptLight.position.y = ptLight.startPos.y + dy * (1 - (4 * (ptLight.t - 0.5) * (ptLight.t - 0.5)));
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
	ground.translateZ( -2 );
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
	cone.translateZ(-10);
	cone.translateX(-7);
	setPickTarget(cone, cone);
	//cone.rotating = true;
	scene.add(cone);
	
	var gPump = makeGreatPumpkin(1);
	gPump.translateZ(-7);
	gPump.translateX(-2);
	gPump.translateY(-4);
	window.setTimeout(function() { gPump.animating = true; }, 2000);
	scene.add(gPump);
	
	var gPump2 = makeGreatPumpkin(1);
	gPump2.name = 'Pumpkin 2';
	gPump2.translateZ(-9);
	gPump2.translateX(-4);
	gPump2.translateY(-4);
// 	window.setInterval(function() { 
// 		gPump2.position.y = -4;
// 		gPump2.animating = true; 
// 	}, 3000);
	//gPump.rotation.x = Math.PI/4;
	scene.add(gPump2);
	
	var gPump3 = makeGreatPumpkin(1);
	gPump3.name = 'Pumpkin 3';
	gPump3.translateZ(-5);
	//gPump3.translateX(-4);
	gPump3.translateY(-4);
	scene.add(gPump3);
	
	var xfmr = makeTransformer(1);
	xfmr.translateX(2);
	xfmr.rotateY(Math.PI/2);
	scene.add(xfmr);
	
	//scene.add(makeJack2(2));
	
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
	console.log(animatables.length + ' animatable objects:');
	//for (var i = 0; i < animatables.length; i++) {
	//	console.log(i.toString() + ': ' + animatables[i].name)
	//}
			
	function animate() {
		requestAnimationFrame(animate);
		// Automatic animations
		animatables.forEach(function(obj) {
			if (obj.timer) {
					obj.update(obj.timer.getT());
			}
			else if (obj.animating) {
				obj.update();
			}
		})
		renderer.render(scene, camera);
	}
	animate();
}

makeWorld();
