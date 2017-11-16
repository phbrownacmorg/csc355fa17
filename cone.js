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
  setPickTarget(group, group);
	return group;
}
