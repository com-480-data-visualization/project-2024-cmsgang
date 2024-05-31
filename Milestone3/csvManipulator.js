let danceabilityModeIndex = -1;
const danceabilityModes = [
    { mode: 'Low', range: [0, 0.25] },
    { mode: 'Med', range: [0.25, 0.5] },
    { mode: 'High', range: [0.5, 0.75] },
    { mode: 'Max', range: [0.75, 1] },
    { mode: 'Any', range: [0, 1]}
];

let valenceModeIndex = -1;
const valenceModes = [
    { mode: '🙁', range: [0, 0.33] },
    { mode: '😐', range: [0.25, 0.5] },
    { mode: '😄', range: [0.5, 1] },
    { mode: 'Any', range: [0, 1]}
];

let lyricModeIndex = -1;
const lyricModes = [
    { mode: 'Off', range: [0, 0.1] },
    { mode: 'Low', range: [0.1, 0.3] },
    { mode: 'Med', range: [0.3, 0.5] },
    { mode: 'High', range: [0.5, 0.75] },
    { mode: 'Max', range: [0.75, 1] },
    { mode: 'Any', range: [0, 1]}
];

let instrumentalModeIndex = -1;
const instrumentalModes = [
    { mode: 'Low', range: [0, 0.1] },
    { mode: 'Med', range: [0.1, 0.5] },
    { mode: 'High', range: [0.5, 1] },
    { mode: 'Any', range: [0, 1]}
];

const keys = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"]

let isSpinning = false;
let initialAngle = 0;
let currentAngle = 0;
let energyValue = 0;

document.addEventListener('DOMContentLoaded', function() {
    fetch('spotify_top_songs_audio_features.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            const filteredData = removeSongsWithEmptyAttributes(parsedData); // Remove songs with missing attributes
            const uniqueData = removeDuplicates(filteredData); // Remove duplicates
            const sortedData = sortSongsAlphabetically(uniqueData); // Sort alphabetically

            displayList(sortedData);
            window.allSongsData = sortedData; // Store all songs data for filtering
        })
        .catch(error => console.error('Error loading the CSV file:', error));
});

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = splitCSVButIgnoreCommasInQuotes(lines[0]);
    const fields = ['track_name', 'artist_names', 'key', 'mode', 'time_signature', 'danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'loudness', 'tempo'];
    const indices = fields.map(field => headers.indexOf(field));

    return lines.slice(1).map(line => {
        const parts = splitCSVButIgnoreCommasInQuotes(line);
        return indices.map(index => parts[index]);
    }).map(parts => ({
        title: parts[0],
        artist: parts[1],
        key: parts[2],
        mode: parseFloat(parts[3]),
        time_signature: parseFloat(parts[4]),
        danceability: parseFloat(parts[5]),
        energy: parseFloat(parts[6]),
        speechiness: parseFloat(parts[7]),
        acousticness: parseFloat(parts[8]),
        instrumentalness: parseFloat(parts[9]),
        liveness: parseFloat(parts[10]),
        valence: parseFloat(parts[11]),
        loudness: Math.abs(parseFloat(parts[12])),
        tempo: parseFloat(parts[13])
    }));
}

function splitCSVButIgnoreCommasInQuotes(text) {
    const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\",]+)|([^",]+))/g;
    let parts = [];
    let match;
    while (match = regex.exec(text)) {
        parts.push(match[1] || match[2] || match[3] || '');
    }
    return parts;
}

function displayList(data) {
    const container = document.getElementById('song-container');
    container.innerHTML = ''; // Clear previous entries

    data.forEach(song => {
        const songBox = document.createElement('div');
        songBox.className = 'song-box';

        const title = document.createElement('span');
        title.className = 'song-title';
        title.textContent = song.title;

        const artist = document.createElement('span');
        artist.className = 'song-artist';
        artist.textContent = song.artist;

        songBox.appendChild(title);
        songBox.appendChild(artist);
        container.appendChild(songBox);

        // Add click event listener to each song box
        songBox.addEventListener('click', function() {
            updateSelectedSong(song);
            updateAttributeBars(song);
        });
    });
}

function updateSelectedSong(song) {
    const selectedSongDiv = document.getElementById('selected-song');
    selectedSongDiv.textContent = `${song.title} | ${song.artist}`; // Update the display with the selected song

    const attributesContainer = document.getElementById('attributes-container');
    attributesContainer.classList.remove('hidden'); // Show the attributes container
}

function filterSongs() {
    const input = document.getElementById('search-input');
    const filter = input.value.toUpperCase();
    const songs = document.querySelectorAll('#list-area .song-box');
    songs.forEach(song => {
        const text = song.textContent || song.innerText ;
        song.style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    });
}

function sortSongsAlphabetically(songs) {
    return songs.sort((a, b) => {
        if (a.title && b.title) {
            return a.title.localeCompare(b.title);
        } else if (a.title) {
            return -1;
        } else if (b.title) {
            return 1;
        } else {
            return 0;
        }
    });
}

function removeDuplicates(songs) {
    const seen = new Set();
    return songs.filter(song => {
        const identifier = `${song.title}|${song.artist}`;
        if (seen.has(identifier) || !song.title || !song.artist) {
            return false;
        } else {
            seen.add(identifier);
            return true;
        }
    });
}

function removeSongsWithEmptyAttributes(songs) {
    return songs.filter(song => {
        return song.danceability && song.energy && song.speechiness && song.acousticness && song.instrumentalness && song.liveness && song.valence && song.loudness && song.tempo;
    });
}

function updateAttributeBars(songData) {
    const minMaxValues = {
        danceability: {min: 0.15, max: 0.985},
        energy: {min: 0.0218, max: 0.989},
        speechiness: {min: 0.0232, max: 0.966},
        acousticness: {min: 0.000008, max: 0.994},
        instrumentalness: {min: 0.0, max: 0.953},
        liveness: {min: 0.0197, max: 0.977},
        valence: {min: 0.032, max: 0.982},
        loudness: {min: 0.02, max: 34.475},
        tempo: {min: 46.718, max: 212.117}
    };

    Object.keys(minMaxValues).forEach(attr => {
        const value = songData[attr];
        const min = minMaxValues[attr].min;
        const max = minMaxValues[attr].max;
        const height = 100 * ((value - min) / (max - min));
        
        const positiveBar = document.getElementById(`${attr}-bar-positive`);
        const negativeBar = document.getElementById(`${attr}-bar-negative`);
        
        
        positiveBar.style.height = `${height}%`; // Adjust height for positive bar
        
        negativeBar.style.height = `${height}%`; // Adjust height for negative bar
        
        const label = document.getElementById(`${attr}-label`);
        label.textContent = `${value.toFixed(2)}`;
        
        
    });
}

/** 
 * When you reset a filter, the other filters should still be applied
 * For example, if you filter by tempo and then reset, the loudness filter should still be applied on a fresh list of songs
 * This function is called after a filter is reset
 */
function applyFiltersAfterReset(attribute, filteredSongs) {

    // Apply loudness filter if it's not the initial value and the attribute is not being reset
    if (attribute !== 'loudness') {
        const loudnessSlider = document.getElementById('loudness-slider');
        const loudnessValue = parseFloat(loudnessSlider.value);
        if (loudnessValue !== parseFloat(loudnessSlider.min)) {
            filteredSongs = filteredSongs.filter(song => song.loudness >= loudnessValue - 1 && song.loudness <= loudnessValue + 1);
        }
    }

    // Apply tempo filter if it's not the initial value and the attribute is not being reset
    if (attribute !== 'tempo') {
        const tempoSlider = document.getElementById('tempo-slider');
        const tempoValue = parseFloat(tempoSlider.value);
        if (tempoValue !== parseFloat(tempoSlider.min)) {
            filteredSongs = filteredSongs.filter(song => song.tempo >= tempoValue - 1 && song.tempo <= tempoValue + 1);
        }
    }

    if(attribute !== 'energy') {
        const energyValue = document.getElementById('energy-value').textContent;
        if (energyValue !== "Any") {
            const floatEnergyValue = parseFloat(energyValue);
            filteredSongs = filteredSongs.filter(song => Math.abs(song.energy - floatEnergyValue) <= 0.05);
        }
    }

    if(attribute !== 'key') {
        const keyValue = document.getElementById('key-value').textContent;
        if (keyValue !== "Any") {
            filteredSongs = filteredSongs.filter(song => song.key === keyValue);
        }
    }

    // Add additional filters here as needed
    
    // Update song list with filtered results
    displayList(filteredSongs);
}

function resetTempoFilter() {
    const tempoSlider = document.getElementById('tempo-slider');
    tempoSlider.value = tempoSlider.min; // Reset to initial value
    document.getElementById('tempo-value').textContent = 'Any';

    applyFiltersAfterReset('tempo', window.allSongsData);
}

function filterSongsByTempo() {
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoValue = parseFloat(tempoSlider.value);
    const filteredSongs = window.allSongsData.filter(song => song.tempo >= tempoValue - 1 && song.tempo <= tempoValue + 1);
    document.getElementById('tempo-value').textContent = tempoValue; // Update the displayed tempo value

    applyFiltersAfterReset('tempo', filteredSongs);
}

function resetLoudnessFilter() {
    const loudnessSlider = document.getElementById('loudness-slider');
    loudnessSlider.value = loudnessSlider.min; // Reset to initial value
    document.getElementById('loudness-value').textContent = 'Any';

    applyFiltersAfterReset('loudness', window.allSongsData);
}

function filterSongsByLoudness() {
    const loudnessSlider = document.getElementById('loudness-slider');
    const loudnessValue = parseFloat(loudnessSlider.value);
    const filteredSongs = window.allSongsData.filter(song => song.loudness >= loudnessValue - 1 && song.loudness <= loudnessValue + 1);
    document.getElementById('loudness-value').textContent = loudnessValue; // Update the displayed loudness value

    applyFiltersAfterReset('loudness', filteredSongs);
}

function toggleDanceabilityMode() {
    danceabilityModeIndex = (danceabilityModeIndex + 1) % danceabilityModes.length;
    const mode = danceabilityModes[danceabilityModeIndex];
    filterSongsByDanceability(mode.range);
    document.getElementById('danceability-mode').textContent = mode.mode; // Update button text to show current mode
}

function filterSongsByDanceability(range) {
    const [min, max] = range;
    const filteredSongs = window.allSongsData.filter(song => song.danceability >= min && song.danceability <= max);
    applyFiltersAfterReset('danceability', filteredSongs);
}

function toggleValenceMode() {
    valenceModeIndex = (valenceModeIndex + 1) % valenceModes.length;
    const mode = valenceModes[valenceModeIndex];
    filterSongsByValence(mode.range);
    document.getElementById('valence-mode').textContent = mode.mode; // Update button text to show current mode
}

function filterSongsByValence(range) {
    const [min, max] = range;
    const filteredSongs = window.allSongsData.filter(song => song.valence >= min && song.valence <= max);
    applyFiltersAfterReset('valence', filteredSongs);
}

function toggleLyricsMode() {
    lyricModeIndex = (lyricModeIndex + 1) % lyricModes.length;
    const mode = lyricModes[lyricModeIndex];
    filterSongsByLyrics(mode.range);
    document.getElementById('lyrics-mode').textContent = mode.mode; // Update button text to show current mode
}

function filterSongsByLyrics(range) {
    const [min, max] = range;
    const filteredSongs = window.allSongsData.filter(song => song.speechiness >= min && song.speechiness <= max);
    applyFiltersAfterReset('lyrics', filteredSongs);
}

function toggleInstrumentalMode() {
    instrumentalModeIndex = (instrumentalModeIndex + 1) % instrumentalModes.length;
    const mode = instrumentalModes[instrumentalModeIndex];
    filterSongsByInstrumental(mode.range);
    document.getElementById('instrumental-mode').textContent = mode.mode; // Update button text to show current mode
}

function filterSongsByInstrumental(range) {
    const [min, max] = range;
    const filteredSongs = window.allSongsData.filter(song => song.instrumentalness >= min && song.instrumentalness <= max);
    applyFiltersAfterReset('instrumental', filteredSongs);
}


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


/** ENERGY DISC FUNCTIONS */
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

        if(discId === 'disc1'){
            updateKey(currentAngle);
        }
        if(discId === 'disc2'){
            updateEnergyValue(currentAngle);
        }
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
    applyFiltersAfterReset('energy', filteredSongs);
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
    document.getElementById('energy-value').textContent = "Any";
    currentAngle = 0;
    document.getElementById('disc2').style.transform = 'rotate(0deg)';
    
    applyFiltersAfterReset('energy', window.allSongsData);
}

// Your existing event listeners for dragging
document.getElementById('disc1').dataset.rotation = '0';
document.getElementById('disc2').dataset.rotation = '0';

document.getElementById('disc1').addEventListener('mousedown', function(e) { startDrag(e, 'disc1'); });
document.getElementById('disc2').addEventListener('mousedown', function(e) { startDrag(e, 'disc2'); });


function updateKey(rotation){
    let angle = rotation % 360;
    if (angle < 0) {
        angle += 360;
    }
    var keyIndex = Math.floor(angle / 30);
    var keySpan = document.getElementById('key-value');
    keySpan.textContent = keys[keyIndex];
    filterSongsByKey();
}

function filterSongsByKey() {
    const keyValue = document.getElementById('key-value').textContent;
    const filteredSongs = window.allSongsData.filter(song => song.key === keyValue);
    applyFiltersAfterReset('key', filteredSongs);
}

function resetKey() {
    document.getElementById('key-value').textContent = "Any";
    document.getElementById('disc1').style.transform = 'rotate(0deg)';
    applyFiltersAfterReset('key', window.allSongsData);
}

