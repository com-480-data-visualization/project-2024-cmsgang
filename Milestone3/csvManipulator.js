document.addEventListener('DOMContentLoaded', function() {
    fetch('spotify_top_songs_audio_features.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            displayList(parsedData);
        })
        .catch(error => console.error('Error loading the CSV file:', error));
});
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(','); // Assuming headers are in the first row
    const trackNameIndex = headers.indexOf('track_name');
    const artistNamesIndex = headers.indexOf('artist_names');

    if (trackNameIndex === -1 || artistNamesIndex === -1) {
        console.error('CSV headers do not contain track_name or artist_names');
        return [];
    }

    return lines.slice(1).map(line => {
        const parts = splitCSVButIgnoreCommasInQuotes(line);
        return {
            title: parts[trackNameIndex], // Use the dynamically found index
            artist: parts[artistNamesIndex] // Use the dynamically found index
        };
    });
}

function splitCSVButIgnoreCommasInQuotes(text) {
    // This regex will split the line by commas but ignore commas within double quotes
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
    });
}



function filterSongs() {
    const input = document.getElementById('search-input');
    const filter = input.value.toUpperCase();
    const songs = document.querySelectorAll('#list-area div');
    songs.forEach(song => {
        const text = song.textContent || song.innerText;
        song.style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    });
}