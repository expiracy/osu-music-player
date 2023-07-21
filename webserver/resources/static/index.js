const playingSongName = document.getElementById("playingSongName");
const playingSongArtist = document.getElementById("playingSongArtist");
const playingSongImage = document.getElementById("playingSongImage");
const placeHolderImage = 'static/images/image-placeholder.jpg';

function fetchSongsData() {
    fetch(`/api/get_mp3s`)
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
/*
<div className="song-div">
    <img src="static/images/image-placeholder.jpg">
        <div className="song-info">
            <h4>Title</h4>
            <p>Line 1 of text</p>
        </div>
</div>
 */

function addSongButton(song) {
    let songButtonDiv = document.createElement('div');
    songButtonDiv.className = "song-div";

    let imageElement = document.createElement('img');
    setImage(song.id, imageElement);

    let songInfo = document.createElement('div');
    songInfo.className = "song-info"

    let name = document.createElement('h4');
    name.textContent = song.name
    let artist = document.createElement('p');
    artist.textContent = song.artist

    songInfo.appendChild(name);
    songInfo.appendChild(artist);

    songButtonDiv.appendChild(imageElement);
    songButtonDiv.appendChild(songInfo);

    songButtonDiv.addEventListener('click', () => {
        playSong(song)
    });

    document.getElementById('songsBox').appendChild(songButtonDiv);
}
function addSongButton2(song) {
    let songButtonDiv = document.createElement('div');
    songButtonDiv.id = song.id;
    songButtonDiv.className = 'song-button';

    // Create the image element
    let imageElement = document.createElement('img');
    imageElement.className = 'song-button-art'
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

    // Append the css to the appropriate parent css
    songInfoDiv.appendChild(songNameDiv);
    songInfoDiv.appendChild(artistNameDiv);

    songButtonDiv.appendChild(imageElement);
    songButtonDiv.appendChild(songInfoDiv);

    songButtonDiv.addEventListener('click', () => {
        playSong(song)
    });

    // Append the main container div to the "container" element in the HTML
    let containerElement = document.getElementById('songsBox');
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
            let audioPlayer = document.getElementById("audioPlayer");

            setImage(song.id, playingSongImage);

            audioPlayer.src = songURL;
            audioPlayer.load();
            audioPlayer.play();
        })
        .catch(error => {
            console.log(song.id)
            console.log(error)
            console.error("Error fetching or processing the song:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchSongsData();
});

function search() {
    let searchFieldContainer = document.getElementById("searchFieldContainer");

    // Toggle the "hidden" class to show/hide the search field
    searchFieldContainer.classList.toggle("hidden");
}