// Global variable to control whether objects are rotating or not
rotating = true;

// Space bar toggles whether objects are rotating
function toggleRotation() {
    rotating = !rotating;
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
function pickObject(obj) {
    // Deselect the previously selected object, if any
    if (selectedObject) {
        selectedObject.selected = false;
        if (selectedObject.material.color) {
            selectedObject.material.color.set(selectedObject.originalColor);
        }
    }
    // Select the new one
    selectedObject = obj;
    selectedObject.selected = true;
    // Indicate the change
    if (selectedObject.material.color) {
      selectedObject.originalColor = selectedObject.material.color.getStyle();
      selectedObject.material.color.set('rgb(255, 0, 0)');
    }
}

function attachHandlers(camera, objList) {
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
        toggleRotation();
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
  var mouse = new THREE.Vector2();
  target.addEventListener('click', function(evt) {
      // Set mouse to NDC
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log(mouse.x + ',' + mouse.y);
      raycaster.setFromCamera(mouse, camera);
      
      var hits = raycaster.intersectObjects(objList, true);
      // Should always be true, since the background planes are included
      if (hits.length > 0 && hits[0].object.pickTarget) {
          pickObject(hits[0].object.pickTarget);
//           for (var i = 0; i < hits.length; i++) {
//             console.log(i + ' ' + hits[i].object.pickTarget);
//           }
//           console.log('');
      }
    
      evt.preventDefault();
  });
  
  // Button handler
  document.getElementById('help-button')
    .addEventListener('click', toggleHelpText);
}

