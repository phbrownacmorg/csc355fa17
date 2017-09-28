// Global variable to control whether objects are rotating or not
rotating = true;

// Space bar toggles whether objects are rotating
function toggleRotation(evt) {
  //alert("caught '" + evt.key + "'");
  if (evt.key === ' ') {
    rotating = !rotating;
    evt.preventDefault();
  }
}

function attachHandlers(camera) {
  var target = document.getElementsByTagName('body')[0];
  target.addEventListener("keypress", toggleRotation);
 
  // Arrow keys move the camera (but not the look-at point)
  target.addEventListener('keydown', function(evt) {
    var d = 0.1;
    // Move the camera
    switch (evt.key) {
      case 'ArrowUp':
        camera.position.y += d;
        break;
      case 'ArrowDown':
        camera.position.y -= d;
        break;
      case 'ArrowLeft':
        camera.position.x -= d;
        break;
      case 'ArrowRight':
        camera.position.x += d;
        break;
    };
    // Common actions for any arrow key
    if (evt.key.startsWith('Arrow')) {
      camera.lookAt.set(0, 0, 0);
      evt.preventDefault();
    }
  });
}