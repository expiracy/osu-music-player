const playingSongName = document.getElementById("playingSongName");
const playingSongArtist = document.getElementById("playingSongArtist");
const playingSongImage = document.getElementById("playingSongImage");
const placeHolderImage = 'static/images/image-placeholder.jpg';

var sideBoxSongs = [];
var mainBoxSongs = [];

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
                addSongButton(song, document.getElementById('songsBox'))
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

function addSongButton(song, element) {
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

    element.appendChild(songButtonDiv);
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
    let substring = document.getElementById("searchInput").value;

    fetch(`/api/search?substring=${substring}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let songsData = JSON.parse(data);

            let sideBox = document.getElementById('sideBox');
            sideBox.innerHTML = "";

            console.log(songsData)

            songsData.forEach(song => {
                addSongButton(song, sideBox)
            });
        })
        .catch(error => {
                console.log(song.id)
                console.log(error)
                console.error("Error fetching or processing the song:", error);
            });
}