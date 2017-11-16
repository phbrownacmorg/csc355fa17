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
	
 	setPickTarget(ignatz, ignatz);
	return ignatz;
}
