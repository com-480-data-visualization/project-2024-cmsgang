function updateSliderValue(slider) {
    var value = slider.value;
    var valueSpan = document.getElementById(slider.name + "-value");
    valueSpan.textContent = value;
}

function toggleSongArtist(button){
    var currentSelection = document.getElementById("List Title");
    if(currentSelection.textContent == "Song List"){
        currentSelection.textContent = "Artist List";
        button.textContent = "Show Song List";
    }
    else{
        currentSelection.textContent = "Song List";
        button.textContent = "Show Artist List";
    }
}


// Get the disc element
var disc = document.getElementById('disc');
var startAngle = 0;
var rotation = 0;

// Function to handle the start of dragging
function startDrag(e, discId) {
    // Prevent default behavior
    e.preventDefault();

    var disc = document.getElementById(discId);
    var rect = disc.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var startX = e.clientX - centerX;
    var startY = e.clientY - centerY;
    var startAngle = Math.atan2(startY, startX);
    var rotation = disc.dataset.rotation ? parseFloat(disc.dataset.rotation) : 0;

    function drag(e) {
        var mouseX = e.clientX - centerX;
        var mouseY = e.clientY - centerY;
        var angle = Math.atan2(mouseY, mouseX);
        var angleDifference = angle - startAngle;
        rotation += angleDifference * (180 / Math.PI);
        disc.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
        startAngle = angle;
        disc.dataset.rotation = rotation; // Store the current rotation
    }

    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

// Initialize rotation for each disc
document.getElementById('disc1').dataset.rotation = '0';
document.getElementById('disc2').dataset.rotation = '0';

// Listen for the start of dragging for each disc
document.getElementById('disc1').addEventListener('mousedown', function(e) { startDrag(e, 'disc1'); });
document.getElementById('disc2').addEventListener('mousedown', function(e) { startDrag(e, 'disc2'); });




