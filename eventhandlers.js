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

function attachHandlers(camera) {
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
  
  // Button handler
  document.getElementById('help-button')
    .addEventListener('click', toggleHelpText);
}

