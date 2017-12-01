function makeLightning(source, target, parent) {
    // Tunable parameters
    var duration = 1000; // in ms
    var numJags = 16;
    var jagScaleFactor = 0.2;
    var thickness = 0.02; // Radius of bolt

    // Start with a straight line
  	var line = new THREE.LineCurve3(source, target);
  	var pts = line.getPoints(numJags + 1); // Gives numJags + 2 points
  
		// Add jaggies
		var jagScale = (source.distanceTo(target) / numJags) * jagScaleFactor;
		// Leave the first and last points alone
 		for (var i = 1; i < numJags + 1; i++) {
 			  var perturbation = new THREE.Vector3(Math.random(), Math.random(),
 																					   Math.random()); // In [0, 1)
        perturbation.subScalar(0.5); // In [-0.5, 0.5)
 				perturbation.multiplyScalar(2 * jagScale); // In [-jagScale, jagScale)
 				pts[i].add(perturbation);
 		}
		var sparkPath = new THREE.CatmullRomCurve3(pts);
		
		var sparkGeom = new THREE.TubeGeometry(sparkPath, 10 * numJags + 1, thickness);
		var sparkMat = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				emissive: 0xffffff,
        side: THREE.DoubleSide
		});
		var spark = new THREE.Mesh(sparkGeom, sparkMat);
		spark.elapsed = 0; // How long since the start of the zap, in ms
		
		spark.turnOn = function() {
			parent.add(spark);
			var timeOn = Math.min(duration - spark.elapsed, Math.random() * duration * 0.5);
			spark.elapsed += timeOn;
			window.setTimeout(spark.turnOff, timeOn);
		}
	
		spark.turnOff = function() {
			parent.remove(spark);
			var timeOff = Math.min(duration - spark.elapsed, Math.random() * duration * 0.1);
			spark.elapsed += timeOff;
			if (spark.elapsed < duration) {
					window.setTimeout(spark.turnOn, timeOff);
			}
		}
		
		spark.turnOn();
}

function makeInsulator(h, isLeft) {
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
	//insulator.add(makeJack2(h));
	
	// Return the location of the insulator's top end in world space
	insulator.findTop = function() {
		var top = new THREE.Vector3(0, h/2, 0);
		top.add(insulator.position);
		return insulator.parent.localToWorld(top);
	};
	
	// Create a lightning bolt from the top of the insulator to
	// targetPt, which is in world space.
	
	insulator.lightningTo = function(targetPt, parent) {
      makeLightning(insulator.findTop(), targetPt, parent);
	};
	
  insulator.translateY(1.5 * h);
  if (isLeft) {
    insulator.translateX(-h/2);
    insulator.rotateZ(Math.PI/15);
  }
  else {
    insulator.translateX(h/2);
    insulator.rotateZ(-Math.PI/15);
  }
	return insulator;
}


function makeTransformer(h) {
	var r = h/3;
	var g = new THREE.CylinderGeometry(r, r, h);
	var m = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: 1.0,
		roughness: 0.9,
		map: new THREE.TextureLoader().load('images/xfmr.png')
	});
	var can = new THREE.Mesh(g, m);
	can.name = 'Zorchimus Deuce';
	
	var ins1 = makeInsulator(h/2, true);
	can.add(ins1);
	
	var ins2 = makeInsulator(h/2, false);
	can.add(ins2);
	
	can.zap = function(point, parent) {
			ins1.lightningTo(point, parent);
			ins2.lightningTo(point, parent);
	};
	
	//can.translateY(h/2);
	return can;
	
}
