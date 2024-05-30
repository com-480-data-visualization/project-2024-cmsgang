document.addEventListener('DOMContentLoaded', function() {
    fetch('spotify_top_songs_audio_features.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            const uniqueData = removeDuplicates(parsedData); // Remove duplicates
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
        key: parseFloat(parts[2]),
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
        const text = song.textContent || song.innerText;
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

function resetFilters() {
    const tempoSlider = document.getElementById('tempo-slider');
    tempoSlider.value = 45; // Reset to initial value
    document.getElementById('tempo-value').textContent = '-';

    const loudnessSlider = document.getElementById('loudness-slider');
    loudnessSlider.value = 0; // Reset to initial value
    document.getElementById('loudness-value').textContent = '-';

    displayList(window.allSongsData); // Display all songs
}

function filterSongsByTempo() {
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoValue = parseFloat(tempoSlider.value);
    const filteredSongs = window.allSongsData.filter(song => song.tempo >= tempoValue - 1 && song.tempo <= tempoValue + 1);
    displayList(filteredSongs);
    document.getElementById('tempo-value').textContent = tempoValue; // Update the displayed tempo value
}

function filterSongsByLoudness() {
    const loudnessSlider = document.getElementById('loudness-slider');
    const loudnessValue = parseFloat(loudnessSlider.value);
    const filteredSongs = window.allSongsData.filter(song => song.loudness >= loudnessValue - 1 && song.loudness <= loudnessValue + 1);
    displayList(filteredSongs);
    document.getElementById('loudness-value').textContent = loudnessValue; // Update the displayed loudness value
}

let isSpinning = false;
let initialAngle = 0;
let currentAngle = 0;
let energyValue = 0;

let isSpinning = false;
let initialAngle = 0;
let currentAngle = 0;
let energyValue = 0;

document.addEventListener('mousemove', function(event) {
    if (isSpinning) {
        const rect = document.getElementById('disc2').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        const deltaAngle = angle - initialAngle;
        
        if ((energyValue === 1 && deltaAngle > 0) || (energyValue === 0 && deltaAngle < 0)) {
            initialAngle = angle;
            return; // Stop spinning if caps are reached
        }
        
        currentAngle += deltaAngle;
        if (currentAngle >= 360) {
            currentAngle -= 360;
        } else if (currentAngle <= -360) {
            currentAngle += 360;
        }
        initialAngle = angle;
        updateEnergyValue(currentAngle);
    }
});

document.addEventListener('mouseup', function() {
    isSpinning = false;
});

function startSpinningDisc(event) {
    isSpinning = true;
    const rect = document.getElementById('disc2').getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    initialAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
}

function updateEnergyValue(angle) {
    let newEnergyValue = angle / 360;
    newEnergyValue = Math.min(Math.max(newEnergyValue, 0), 1); // Clamp value between 0 and 1
    energyValue = newEnergyValue;
    document.getElementById('energy-value').textContent = newEnergyValue.toFixed(2);
}

function resetEnergy() {
    energyValue = 0;
    document.getElementById('energy-value').textContent = energyValue.toFixed(2);
    currentAngle = 0;
    document.getElementById('disc2').style.transform = 'rotate(0deg)';
}

