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
    setPickTarget(gourd, gourd);
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
