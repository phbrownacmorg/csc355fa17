// Space bar toggles whether objects are rotating
function toggleRotation(obj) {
    // Instead of simple negation, this handles the case where the attribute
    //   hasn't been set previously
    if (!obj.rotating) { 
      obj.rotating = true;
    }
    else { obj.rotating = false; }
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
  if (obj.material.color) {
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
    setSelected(selectedObject, true);
}

// Converts the clientX and clientY of an event to NDC,
// and returns a Vector2 set to the NDC values.
function toNDC(event) {
    var ndc = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
                                -(event.clientY / window.innerHeight) * 2 + 1);
    return ndc;
}

function attachHandlers(camera, objList) {
  // Find the cone
  var cone = objList.filter(function(obj) {
                                return obj.rotating;
                           })[0];  // Only one object will pass the filter
  
  var target = document.getElementsByTagName('body')[0];
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
        moveCamera(camera, -d, 0);
        break;
      case 'ArrowRight':
        moveCamera(camera, d, 0);
        break;
      // Spacebar toggles rotation
      case ' ':
        toggleRotation(cone);
        break;
      // ? toggles help text
      case '?':
        toggleHelpText();
        break;
    };
    evt.preventDefault();
  });
  
  // Mouse handler
  var raycaster = new THREE.Raycaster();
  var click = new THREE.Vector2();
  
  var mousemovehandler = function(evt) {
      var mouse = toNDC(evt);
      // busy test *really* needs an atomic test-and-set
      if (selectedObject && !selectedObject.busy) {
          selectedObject.busy = true; // Flag to tell animate() not to mess...
          var rot = selectedObject.getWorldQuaternion();
          var invRot = rot.clone().inverse();
          // Need to un-rotate first, so translation is in world X and Y
          selectedObject.applyQuaternion(invRot);
          // Make mouse relative to preceding coords
          selectedObject.translateX(mouse.x - click.x);
          selectedObject.translateY(mouse.y - click.y);
          // Need to re-rotate the object, so translation doesn't
          // overwrite its local rotation
          selectedObject.applyQuaternion(rot);
          click.copy(mouse);  // Only copy if this event was handled
          selectedObject.busy = false;
      }
      evt.preventDefault();
  }
  
  target.addEventListener('mousedown', function(evt) {
      // Set mouse to NDC
      click = toNDC(evt);
      console.log(click.x + ',' + click.y);
      raycaster.setFromCamera(click, camera);
      
      var hits = raycaster.intersectObjects(objList, true);
      // hits.length always > 0, since the background planes are included
      if (hits.length > 0 && hits[0].object.pickTarget) {
          pickObject(hits[0].object.pickTarget);
      }
    
      target.addEventListener('mousemove', mousemovehandler);
      evt.preventDefault();
  });
  
  target.addEventListener('mouseup', function(evt) {
      target.removeEventListener('mousemove', mousemovehandler);
      evt.preventDefault();
  });
  
  // Button handler
  document.getElementById('help-button')
    .addEventListener('click', toggleHelpText);
}

