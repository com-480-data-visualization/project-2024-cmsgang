function updateSliderValue(slider) {
    var value = slider.value;
    var valueSpan = document.getElementById(slider.name + "-value");
    valueSpan.textContent = value;
}

function toggleSongArtist(button) {
    var currentSelection = document.getElementById("List Title");
    if (currentSelection.textContent == "Song List") {
        currentSelection.textContent = "Artist List";
        button.textContent = "Show Song List";
    } else {
        currentSelection.textContent = "Song List";
        button.textContent = "Show Artist List";
    }
}

function startDrag(e, discId) {
    e.preventDefault();

    var disc = document.getElementById(discId);
    var rect = disc.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var startX = e.clientX - centerX;
    var startY = e.clientY - centerY;
    initialAngle = Math.atan2(startY, startX);
    currentAngle = disc.dataset.rotation ? parseFloat(disc.dataset.rotation) : 0;

    isSpinning = true;

    function drag(e) {
        if (!isSpinning) return;

        var mouseX = e.clientX - centerX;
        var mouseY = e.clientY - centerY;
        var angle = Math.atan2(mouseY, mouseX);
        var angleDifference = angle - initialAngle;

        // Get current energy value
        var energySpan = document.getElementById('energy-value');
        var energyValue = parseFloat(energySpan.textContent);

        if ((energyValue === 1 && angleDifference > 0) || (energyValue === 0 && angleDifference < 0)) {
            initialAngle = angle;
            return; // Stop spinning if caps are reached
        }

        currentAngle += angleDifference * (180 / Math.PI);
        if (currentAngle >= 360) {
            currentAngle -= 360;
        } else if (currentAngle <= -360) {
            currentAngle += 360;
        }

        initialAngle = angle;
        disc.dataset.rotation = currentAngle; // Store the current rotation

        // Throttle updates
        if (lastUpdateTime && Date.now() - lastUpdateTime < 16) {
            return;
        }
        lastUpdateTime = Date.now();

        updateEnergyValue(currentAngle);
        disc.style.transform = 'rotate(' + currentAngle + 'deg)';
    }

    function stopDrag() {
        isSpinning = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

let lastUpdateTime = 0;

function filterSongsByEnergy() {
    const energyValue = parseFloat(document.getElementById('energy-value').textContent);
    const filteredSongs = window.allSongsData.filter(song => Math.abs(song.energy - energyValue) <= 0.05);
    displayList(filteredSongs);
}

function updateEnergyValue(rotation) {
    let angle = rotation % 360;
    if (angle < 0) {
        angle += 360;
    }
    let newEnergyValue = angle / 360;
    newEnergyValue = Math.min(Math.max(newEnergyValue, 0), 1); // Clamp value between 0 and 1
    document.getElementById('energy-value').textContent = newEnergyValue.toFixed(2);
    filterSongsByEnergy(); // Call the filter function when energy value is updated
}

function resetEnergy() {
    energyValue = 0;
    document.getElementById('energy-value').textContent = energyValue.toFixed(2);
    currentAngle = 0;
    document.getElementById('disc2').style.transform = 'rotate(0deg)';
    displayList(window.allSongsData); // Reset the song list
}

// Your existing event listeners for dragging
document.getElementById('disc1').dataset.rotation = '0';
document.getElementById('disc2').dataset.rotation = '0';

document.getElementById('disc1').addEventListener('mousedown', function(e) { startDrag(e, 'disc1'); });
document.getElementById('disc2').addEventListener('mousedown', function(e) { startDrag(e, 'disc2'); });