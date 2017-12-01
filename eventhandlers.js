// Extremely minimal Timer class
var Timer = function(time) {
    this.startTime;
    this.maxTime = time;
  
    this.start = function() {
        this.startTime = Date.now();
    }
    
    this.getElapsed = function() {
        return Date.now() - this.startTime;
    }
    
    this.getT = function() {
        // t never exceeds 1
        return Math.min(1, this.getElapsed()/this.maxTime);
    }
}

// Space bar toggles whether objects are animating
function toggleAnimation(obj) {
    // Instead of simple negation, this handles the case where the attribute
    //   hasn't been set previously
    if (!obj.animating) { 
      obj.animating = true;
    }
    else { obj.animating = false; }
}

function toggleHelpText() {
  //alert('toggleHelpText called');
  var textElt = document.getElementById('help-text');
  var zIndex = textElt.style.zIndex || -1; // Ensure it has a value
  //alert(zIndex);
  textElt.style.zIndex = -zIndex;
  var button = document.getElementById('help-button');
  if (zIndex > 0) {
      button.value = 'Show help';
  }
  else {
      button.value = 'Hide help';
  }
}

function moveCamera(camera, dx, dy) {
  camera.position.x += dx;
  camera.position.y += dy;
  // Doesn't work.  Here to document the intent.
  camera.lookAt.set(0, 0, 0);
}

var selectedObject;

function setSelected(obj, selectVal) {
  obj.selected = selectVal;
  // Would need to fix to turn Steve colors.  He has an array of materials,
  // not just one.
  if (obj.material && obj.material.color) {
    if (selectVal) {
      obj.originalColor = obj.material.color.getStyle();
      obj.material.color.set('rgb(255, 0, 0)');
      console.log(obj.originalColor);
    }
    else {
      obj.material.color.set(obj.originalColor);
    }
  }
  
  for (var i = 0; i < obj.children.length; i++) {
    setSelected(obj.children[i], selectVal);
  }
}

function pickObject(obj) {
    // Deselect the previously selected object, if any
    if (selectedObject) {
        setSelected(selectedObject, false);
    }
    // Select the new one
    selectedObject = obj;
    if (selectedObject) {
        setSelected(selectedObject, true);
    }
}

// Converts the clientX and clientY of an event to NDC,
// and returns a Vector2 set to the NDC values.
function toNDC(event) {
    var ndc = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
                                -(event.clientY / window.innerHeight) * 2 + 1);
    return ndc;
}

// Find and return the perspective depth scaling factor for 
// THREE.Object3D 'obj', from the point of view of THREE.Camera 'camera'.
// 'obj' and 'camera' are not changed.
function depthScalingFactor(obj, camera) {
    // pickedItem.parent === scene, so 
    //   pickedItem.matrix === pickedItem.matrixWorld
    var objLoc = new THREE.Vector3();
    objLoc.setFromMatrixPosition(obj.matrixWorld);
    var eyeLoc = new THREE.Vector3();
    eyeLoc.setFromMatrixPosition(camera.matrixWorld);
    
    var diff = new THREE.Vector3();
    diff.subVectors(eyeLoc, objLoc);
    diff.projectOnVector(camera.getWorldDirection());

    return diff.length();
}    

function translateObjInWorld(obj, dist, q, worldAxis) {
    var objAxis = worldAxis.applyQuaternion(q);
    objAxis.normalize();
    obj.translateOnAxis(objAxis, dist);
}

function dragObject(obj, move, camera) {
    // Apply a perspective correction to dx and dy
    move.multiplyScalar(depthScalingFactor(obj, camera));
  
    var rect = document.getElementById('help-form').previousSibling.getBoundingClientRect();
  
    //console.log('\nmy:', move.y, 
    //            '\nw:', rect.width, '\nh:', rect.height);
    // Scale move.y because NDC isn't square in screen space
    move.setY(move.y * rect.height/rect.width);
    //console.log('\nmy 2:', move.y);
  
    //move.set(move.x * correctNDC.x, move.y * correctNDC.y);
    // Empirical fudge factor
    var fudge = 0.95;
    move.multiplyScalar(fudge);
  
    var rot = selectedObject.getWorldQuaternion();
    var invRot = rot.clone().inverse();
    translateObjInWorld(obj, move.x, invRot, new THREE.Vector3(1, 0, 0));
    translateObjInWorld(obj, move.y, invRot, new THREE.Vector3(0, 1, 0));
}

// function getObjFromName(objList, name) {
//   var filt = objList.filter(function(obj) {
//                                 return obj.name === name;
//                            });
//   return filt[0];
// }

function attachHandlers(camera, scene) {
  var ptLight = scene.getObjectByName('Light');
  var target = document.getElementsByTagName('body')[0];
  //console.log(target);
  
  var cone = scene.getObjectByName('Ice cream cone');  // Only one object will pass the filter
  var ignatz = scene.getObjectByName('Ignatz');
  
  target.addEventListener('keydown', function(evt) {
    var d = 0.1;
    switch (evt.key) {
      // Arrow keys move the camera (but not the look-at point)
      case 'ArrowUp':
        moveCamera(camera, 0, d);
        break;
      case 'ArrowDown':
        moveCamera(camera, 0, -d);
        break;
      case 'ArrowLeft':
        //moveCamera(camera, -d, 0);
        ptLight.t = Math.max(0, ptLight.t - ptLight.dt);
        ptLight.update();
        break;
      case 'ArrowRight':
        ptLight.t = Math.min(1, ptLight.t + ptLight.dt);
        ptLight.update();
        //moveCamera(camera, d, 0);
        break;
      // Spacebar toggles rotation
      case ' ':
        toggleAnimation(cone);
        break;
      // ? toggles help text
      case '?':
        toggleHelpText();
        break;
      // Make ignatz jump
      case 'j':
        ignatz.animating = true;
        break;
      // Toggle Steve bouncing 
      case 's':
        var steve = scene.getObjectByName('Steve');
        toggleAnimation(steve);
        break;
      // Make the third Great Pumpkin rise
      case 't':
        var pumpkin = scene.getObjectByName('Pumpkin 3');
        pumpkin.start();
        break;
    }
    //evt.preventDefault();
  });
  
  // Mouse handler
  var raycaster = new THREE.Raycaster();
  var click = new THREE.Vector2();
  
  var mousemovehandler = function(evt) {
      var mouse = toNDC(evt);
      // busy test *really* needs an atomic test-and-set
      if (selectedObject) {
          dragObject(selectedObject, 
                     new THREE.Vector2(mouse.x - click.x, mouse.y - click.y), 
                     camera);
          click.copy(mouse);  // Only copy if this event was handled
      }
      //evt.preventDefault();
  }
  
  var xfmr = scene.getObjectByName('Zorchimus Deuce');
  target.addEventListener('mousedown', function(evt) {
      // Set mouse to NDC
      click = toNDC(evt);
      //console.log(click.x + ',' + click.y);
      raycaster.setFromCamera(click, camera);
      
      var hits = raycaster.intersectObjects(scene.children, true);
      // hits.length always > 0, since the background planes are included
      // xfmr.parent is the scene
      var targetPt = hits[0].point.clone();
      // Tunable limit to keep the lightning bolt from going off into the distance
      var minZ = -20;
      if (targetPt.z < minZ) {
          // Need to clamp to a point on the viewing ray, so the endpoint
          // is actually where the mouse clicked
          var viewRay = targetPt.clone();
          viewRay.sub(camera.position);
          
          // I *could* solve for where the viewing ray crosses z = minZ,
          // or I could just clamp the length in a parallel projection
          viewRay.clampLength(0, camera.position.z - minZ);
          targetPt.add(camera.position, viewRay);
      }
      //targetPt.z = Math.max(minZ, targetPt.z);
      xfmr.zap(targetPt, xfmr.parent);
      
      // Was here to select an object by clicking on it
//       pickObject(hits[0].object.pickTarget);
//       target.addEventListener('mousemove', mousemovehandler);
  });
  
  target.addEventListener('mouseup', function(evt) {
      target.removeEventListener('mousemove', mousemovehandler);
      //evt.preventDefault();
  });
  
  // Button handler
  document.getElementById('help-button')
    .addEventListener('click', toggleHelpText);
  
  var icecream = cone.getObjectByName('ice cream');
  icecream.target = ignatz;
  document.getElementById('slider').addEventListener('input', function() { 
    icecream.update(slider.value);
  });
}

