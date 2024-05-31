var clientId = '3c70a68b72ef46b8b4a2ed872032c8c8';
var clientSecret = '1c22bf3cd29948d195f8f18b152d0e1d';


// Function to fetch access token
async function fetchAccessToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    return data.access_token;
}

// Function to search for a song
async function getTrackById(trackId) {
    const token = await fetchAccessToken();
    const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await result.json();
    return data; // Return the track
}


// Function to play the song snippet
function playSong(url) {
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progressCircle = document.querySelector('.progress-ring__circle');
    
    audioPlayer.src = url;
    audioPlayer.volume = 0.5; // Set volume to 50%
    audioPlayer.play();

    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playButton.onclick = () => pauseSong();

    audioPlayer.ontimeupdate = () => {
        const progress = audioPlayer.currentTime / audioPlayer.duration;
        const circumference = progressCircle.r.baseVal.value * 2 * Math.PI;
        progressCircle.style.strokeDashoffset = circumference - (progress * circumference);
    };

    audioPlayer.onended = () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playButton.onclick = () => playSong(url);
        progressCircle.style.strokeDashoffset = progressCircle.getTotalLength();
    };
}

// Function to pause the song
function pauseSong() {
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    audioPlayer.pause();

    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playButton.onclick = () => playSong(audioPlayer.src);
}
