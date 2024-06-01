# Milestone 3

## Table of Contents
- [Overview](#overview)
- [Technical Setup](#technical-setup)
  - [Files and Structure](#files-and-structure)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
- [Intended Usage](#intended-usage)
  - [Search and Filter Songs](#search-and-filter-songs)
  - [Sort Songs](#sort-songs)
  - [DJ Table Filters](#dj-table-filters)
  - [Audio Player](#audio-player)
  - [Reset Filters and Sorting](#reset-filters-and-sorting)

## Overview
Our visualization consists of a web application designed to allow users to search, filter, sort, and play songs. The interface includes search functionality, multiple filters for song attributes, sorting options, and an audio player for previewing tracks.

## Technical Setup

### Files and Structure
- `index.html`: The main HTML file that structures the web page.
- `styles.css`: The CSS file that contains styles for the HTML elements.
- `csvManipulator.js`: The JavaScript file that handles data manipulation, filtering, sorting, and event handling.
- `spotifyAPI.js`: The JavaScript file to interact with Spotify API for fetching track details (not detailed here).
- `Images/`: Directory containing images used in the application (e.g., play/pause buttons, sort arrows).
- `vids/`: Directory containing videos for the stickman dances.

### Installation
1. Clone the repository to your local machine.
2. Ensure you have a web server setup to serve the files (e.g., using VS Code Live Server extension or any other local server).
3. Open `index.html` in a web browser.

## Intended Usage

### Search and Filter Songs
- **Search Bar**: Enter song titles or artist names in the search bar to filter the song list dynamically.
- **Attribute Filters**: The vertical bars display the attribute values of the selected song. Click on any bar to apply a filter for that specific attribute, adjusting the song list accordingly.

### Sort Songs
- **Sort Buttons**: Use the small grid buttons in the SORT MACHINE section to sort songs by attributes like danceability, energy, etc.
  - Toggle the buttons to apply or remove sorting based on different attributes.
  - The active filters are highlighted in purple.
- **Sort Direction**: Use the up and down arrows to sort in ascending or descending order.

### DJ Table Filters
- **Danceability Mode**: Toggle through different danceability modes (Low, Med, High, Max, Any) by clicking the "Danceability" button. The list updates to show songs matching the selected mode.
- **Valence Mode**: Toggle through different valence modes (🙁, 😐, 😄, Any) by clicking the "Mood" button. The list updates to show songs matching the selected mood.
- **Lyrics Mode**: Toggle through different speechiness levels (Off, Low, Med, High, Max, Any) by clicking the "Speech" button. The list updates to show songs matching the selected level.
- **Instrumental Mode**: Toggle through different instrumentalness levels (Low, Med, High, Any) by clicking the "Instrumental" button. The list updates to show songs matching the selected level.
- **Key**: Use the key disc to filter songs by their musical key. Rotate the disc to select a specific key, and the list updates accordingly.
- **Energy**: Use the energy disc to filter songs by their energy level. Rotate the disc to set a specific energy level, and the list updates accordingly.
- **Tempo**: Use the tempo slider to filter songs by their tempo. Adjust the slider to set a specific tempo range, and the list updates accordingly.
- **Loudness**: Use the loudness slider to filter songs by their loudness. Adjust the slider to set a specific loudness range, and the list updates accordingly.

### Audio Player
- **Play/Pause**: Select a song from the list to load it into the audio player. Click the play button to start the audio preview, and the button toggles to pause.
- **Progress Indicator**: The circular progress indicator shows the play progress of the track.

### Reset Filters and Sorting
- **Reset Individual Filters**: Click the reset buttons next to each slider or attribute to reset individual filters.
- **Reset All Filters**: Click the "Reset All Filters" button to clear all filters and sorting, reverting to the default song list.

## Notes
- The application reads data from `spotify_top_songs_audio_features.csv` which must be available in the correct format.
- The application supports interaction with the Spotify API to fetch additional track details.
- Ensure you have internet connectivity to load external libraries and fetch data from the Spotify API.

This guide should help you set up and use the Interactive DJ Booth application effectively. If you encounter any issues, please refer to the comments and documentation within the source code files for further details.
