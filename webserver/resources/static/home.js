const playingSongName = document.getElementById("playing-song-name");
const playingSongArtist = document.getElementById("playing-song-artist");
const playingSongImage = document.getElementById("playing-song-image");
const placeHolderImage = 'static/images/image-placeholder.jpg';

function fetchSongsData() {
    fetch(`/api/get_songs`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let songsData = JSON.parse(data);

            songsData.forEach(song => {
                addSongButton(song)
            });
        })
}

function addSongButton(song) {
    let songButtonDiv = document.createElement('div');
    songButtonDiv.id = song.id;
    songButtonDiv.className = 'song-button';

    // Create the image element
    let imageElement = document.createElement('img');
    imageElement.alt = 'Album Art';
    imageElement.width = 38;
    imageElement.height = 24;
    setImage(song.id, imageElement);

    // Create the song-info div
    let songInfoDiv = document.createElement('div');
    songInfoDiv.className = 'song-info';

    // Create the song title div
    let songNameDiv = document.createElement('div');
    songNameDiv.className = 'song-name'; // Corrected class name from 'song-title' to 'song-name'
    songNameDiv.textContent = song.name;

    // Create the artist name div
    let artistNameDiv = document.createElement('div');
    artistNameDiv.className = 'artist-name';
    artistNameDiv.textContent = song.artist;

    // Append the elements to the appropriate parent elements
    songInfoDiv.appendChild(songNameDiv);
    songInfoDiv.appendChild(artistNameDiv);

    songButtonDiv.appendChild(imageElement);
    songButtonDiv.appendChild(songInfoDiv);

    songButtonDiv.addEventListener('click', () => {
        playSong(song)
    });

    // Append the main container div to the "container" element in the HTML
    let containerElement = document.getElementById('songsList');
    containerElement.appendChild(songButtonDiv);
}

function setImage(songId, element) {
    fetch(`/api/get_media?song_id=${songId}&type=image`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(data => {
            let imageBlob = new Blob([data], { type: 'image/jpeg' });

            element.src = URL.createObjectURL(imageBlob);
        })
        .catch(error => {
            console.log(songId)
            console.log(error)
            element.src = placeHolderImage;
        });
}

function playSong(song) {
    playingSongName.innerText = song.name;
    playingSongArtist.innerText = song.artist;
    setImage(song.id, playingSongImage)

    // Call the API to get the song URL
    fetch(`/api/get_media?song_id=${song.id}&type=audio`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(data => {
            // Create an object URL from the Blob
            let songBlob = new Blob([data], { type: 'audio/mpeg' });
            let songURL = URL.createObjectURL(songBlob);

            // Play the song using an audio element
            let audioPlayer = document.getElementById("audio-player");

            setImage(song.id, playingSongImage);

            audioPlayer.src = songURL;
            audioPlayer.load();
            audioPlayer.play();
        })
        .catch(error => {
            console.error("Error fetching or processing the song:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchSongsData();
});