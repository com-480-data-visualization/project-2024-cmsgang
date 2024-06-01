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

let sortedSongs = [];

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

    const barContainers = document.querySelectorAll('.vertical-bar-container');
    barContainers.forEach(container => {
        const positiveBar = container.querySelector('.vertical-bar.positive');
        const negativeBar = container.querySelector('.vertical-bar.negative');

        container.addEventListener('mouseenter', function() {
            positiveBar.classList.add('hovered');
            negativeBar.classList.add('hovered');
        });

        container.addEventListener('mouseleave', function() {
            positiveBar.classList.remove('hovered');
            negativeBar.classList.remove('hovered');
        });
    });
});

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = splitCSVButIgnoreCommasInQuotes(lines[0]);
    const fields = ['track_name', 'artist_names', 'key', 'mode', 'time_signature', 'danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'loudness', 'tempo', 'id'];
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
        tempo: Math.round(parseFloat(parts[13])),
        id: parts[14]
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
        songBox.addEventListener('click', async function() {
            updateSelectedSong(song);
            updateAttributeBars(song);
            const track = await getTrackById(song.id);
            
            // If the track exists and has a preview URL, show the audio player and play the song
            if (track && track.preview_url) {
                document.getElementById('audio-player-container').style.display = 'block';
                playSong(track.preview_url);
            } else {
                // Otherwise, pause the song in case one was playing previously and hide the audio player
                pauseSong();
                document.getElementById('audio-player-container').style.display = 'none';
            }
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

        // Tempo should be represented as a whole number
        if(attr === 'tempo'){
            label.textContent = `${value.toFixed(0)}`;
        }else{
            label.textContent = `${value.toFixed(2)}`;
        }
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

    if(attribute !== 'allbuttons') {
        if (danceabilityModeIndex !== -1) {
            const danceabilityMode = danceabilityModes[danceabilityModeIndex].range;
            filteredSongs = filteredSongs.filter(song => song.danceability >= danceabilityMode[0] && song.danceability <= danceabilityMode[1]);
        }

        if (valenceModeIndex !== -1) {
            const valenceMode = valenceModes[valenceModeIndex].range;
            filteredSongs = filteredSongs.filter(song => song.valence >= valenceMode[0] && song.valence <= valenceMode[1]);
        }

        if (lyricModeIndex !== -1) {
            const lyricMode = lyricModes[lyricModeIndex].range;
            filteredSongs = filteredSongs.filter(song => song.speechiness >= lyricMode[0] && song.speechiness <= lyricMode[1]);
        }

        if (instrumentalModeIndex !== -1) {
            const instrumentalMode = instrumentalModes[instrumentalModeIndex].range;
            filteredSongs = filteredSongs.filter(song => song.instrumentalness >= instrumentalMode[0] && song.instrumentalness <= instrumentalMode[1]);
        }
    }

    // Sort songs based on the active 
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

/** Resets the Danceability, Valence, Lyrics, and Instrumental buttons */
function resetButtonFilters(){
    document.getElementById('danceability-mode').textContent = "Any";
    document.getElementById('valence-mode').textContent = "Any";
    document.getElementById('lyrics-mode').textContent = "Any";
    document.getElementById('instrumental-mode').textContent = "Any";
    danceabilityModeIndex = -1;
    valenceModeIndex = -1;
    lyricModeIndex = -1;
    instrumentalModeIndex = -1;
    applyFiltersAfterReset('allbuttons', window.allSongsData);
}

function resetAllFilters(){
    resetEnergy();
    resetTempoFilter();
    resetLoudnessFilter();
    resetKey();
    resetButtonFilters();
}

function setHighlight(element){
    element.style.color = '#ff7332';
    setTimeout(function(){ element.style.color = '#1B1141'; }, 1500);

}

/** When clicking on a bar, set the respective filter on the DJ board and apply it */
function applyFilterFromBar(attribute){
    label = document.getElementById(attribute + '-label');
    value = parseFloat(label.textContent);

    if(attribute === 'tempo'){
        let tempoSlider = document.getElementById('tempo-slider');
        tempoSlider.value = value;
        filterSongsByTempo();
        
        /**link visual cue to dj booth */
        let tempoLabel = document.getElementById('tempo-slider-label');
        setHighlight(tempoLabel);
    }

    if(attribute === 'loudness'){
        let loudnessSlider = document.getElementById('loudness-slider');
        loudnessSlider.value = value;
        filterSongsByLoudness();

        /**link visual cue to dj booth */
        let loudnessLabel = document.getElementById('loudness-slider-label');
        setHighlight(loudnessLabel);
    }

    if(attribute === 'energy'){
        // Set the energy value to the value of the bar clicked
        let energySpan = document.getElementById('energy-value');
        energySpan.textContent = value;
        // Spin the energy disc to the correct position
        let disc = document.getElementById('disc2');
        disc.style.transform = 'rotate(' + (value * 360) + 'deg)';
        filterSongsByEnergy();

        /**link visual cue to dj booth */
        let energydjLabel = document.getElementById('energy-dj-label');
        setHighlight(energydjLabel);
    }

    if(attribute === 'key'){
        // Set the key value to the value of the bar clicked
        let keySpan = document.getElementById('key-value');
        keySpan.textContent = keys[Math.floor(value / 30)];
        filterSongsByKey();
    }
    if(attribute === 'danceability'){
        // Set the danceability mode to the value of the bar clicked
        for(let i = 0; i < danceabilityModes.length; i++){
            console
            if(value >= danceabilityModes[i].range[0] && value <= danceabilityModes[i].range[1]){
                danceabilityModeIndex = i;
                document.getElementById('danceability-mode').textContent = danceabilityModes[i].mode;
                break;
            }
        }
        filterSongsByDanceability(danceabilityModes[danceabilityModeIndex].range);

        /**link visual cue to dj booth */
        let dancedjLabel = document.getElementById('dance-dj-label');
        setHighlight(dancedjLabel);
    }

    if(attribute === 'valence'){
        // Set the valence mode to the value of the bar clicked
        for(let i = 0; i < valenceModes.length; i++){
            if(value >= valenceModes[i].range[0] && value <= valenceModes[i].range[1]){
                valenceModeIndex = i;
                document.getElementById('valence-mode').textContent = valenceModes[i].mode;
                break;
            }
        }
        filterSongsByValence(valenceModes[valenceModeIndex].range);

        /**link visual cue to dj booth */
        let mooddjLabel = document.getElementById('mood-dj-label');
        setHighlight(mooddjLabel);
    }
    if(attribute === 'speechiness'){
        // Set the lyrics mode to the value of the bar clicked
        for(let i = 0; i < lyricModes.length; i++){
            if(value >= lyricModes[i].range[0] && value <= lyricModes[i].range[1]){
                lyricModeIndex = i;
                document.getElementById('lyrics-mode').textContent = lyricModes[i].mode;
                break;
            }
        }
        filterSongsByLyrics(lyricModes[lyricModeIndex].range);

        /**link visual cue to dj booth */
        let speechdjLabel = document.getElementById('speech-dj-label');
        setHighlight(speechdjLabel);
    }

    if(attribute === 'instrumentalness'){
        // Set the instrumental mode to the value of the bar clicked
        for(let i = 0; i < instrumentalModes.length; i++){
            if(value >= instrumentalModes[i].range[0] && value <= instrumentalModes[i].range[1]){
                instrumentalModeIndex = i;
                document.getElementById('instrumental-mode').textContent = instrumentalModes[i].mode;
                break;
            }
        }
        filterSongsByInstrumental(instrumentalModes[instrumentalModeIndex].range);

        /**link visual cue to dj booth */
        let insdjLabel = document.getElementById('ins-dj-label');
        setHighlight(insdjLabel);
    }
}


// Global variable to track active filters
let activeFilters = [];

// Toggle button color and update filters
function toggleButton(button) {
    button.classList.toggle('green');
    const filter = getFilterFromButton(button.id);
    if (button.classList.contains('green')) {
        activeFilters.push(filter);
    } else {
        activeFilters = activeFilters.filter(activeFilter => activeFilter !== filter);
    }
    sortSongList();
}

// Function to get filter attribute from button ID
function getFilterFromButton(buttonId) {
    switch (buttonId) {
        case 'button1':
            return 'danceability';
        case 'button2':
            return 'energy';
        case 'button3':
            return 'speechiness';
        case 'button5':
            return 'acousticness';
        case 'button6':
            return 'instrumentalness';
        case 'button7':
            return 'liveness';
        case 'button9':
            return 'valence';
        case 'button10':
            return 'loudness';
        case 'button11':
            return 'tempo';
        case 'button12':
            return 'key';
        default:
            return null;
    }
}

// Function to sort the song data based on the selected filter buttons
function sortSongList() {
    let sortedSongs = [...window.allSongsData]; // Make a copy of the data

    activeFilters.forEach(param => {
        sortedSongs = sortedSongs.sort((a, b) => {
            return a[param] - b[param];
        });
    });

    if(sortDirection === 'Asc.'){
        displayList(sortedSongs);
    }else{
        displayList(sortedSongs.reverse());
    }
}

// Toggle sort direction
let sortDirection = 'Asc.';
function toggleSortDirection(buttonSortDirection){
    sortDirection = buttonSortDirection;
    sortSongList();
    if(sortDirection === 'Asc.'){
        document.getElementById('sort-asc').src = 'Images/upArrow.png';
        document.getElementById('sort-desc').src = 'Images/downArrowGray.png';
    }else{
        document.getElementById('sort-asc').src = 'Images/upArrowGray.png';
        document.getElementById('sort-desc').src = 'Images/downArrow.png';
    }

}

/* let sortKeyIndex = -1;
function toggleSortKey(button){
    // Toggle sort key
    sortKeyIndex = (sortKeyIndex + 1) % keys.length;
    button.textContent = "Key: \n\n" + keys[sortKeyIndex];
    filterSongsByKey(); 
} */

function resetAllModes() {
    activeFilters = [];
    sortDirection = 'Desc.';
    sortKeyIndex = -1;
    const buttons = document.querySelectorAll('.small-grid-button');
    buttons.forEach(button => button.classList.remove('green'));

    toggleSortDirection('Asc.');

    sortSongList();
}

function toggleDiscImage(action, discID){
    if(action === "on"){
        document.getElementById(discID).src = 'Images/disc_green.png';
    }else{
        document.getElementById(discID).src = 'Images/disc_normal.png';
    }


    

}
