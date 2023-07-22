const placeHolderImage = 'static/images/image-placeholder.jpg';
var queueSize = 0;
var currentPlaylist = "library";

function addToQueue(song) {
    fetch(`/api/add_song?song_id=${song.id}&playlist_name=queue`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        queueSize = JSON.parse(data);
    })
    .catch(error => {
        console.error(error);
    });
}

function playNextInQueue() {
    fetch(`/api/dequeue`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        queueSize -= 1;
        let song = JSON.parse(data);
        playSong(song);
    })
    .catch(error => {
        console.error(error);
    });
}

function removeFromQueue(songIndex) {
    fetch(`/api/remove_song?playlist_name=queue&method=index&index=${songIndex}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        let songsData = JSON.parse(data);
        setSongsBox(songsData);
    })
    .catch(error => {
        console.error(error);
    });
}

function fetchPlaylist(playlist) {
    currentPlaylist = playlist;
    fetch(`/api/get_playlist?name=${playlist}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        let songsData = JSON.parse(data);
        setSongsBox(songsData);
    })
    .catch(error => {
        console.error(error);
    });
}

function fetchSongLibrary() {
    currentPlaylist = "library";
    //fetch(`/api/get_mp3s?alphabetical=${alphabetical}`)
    fetch(`/api/get_library`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        let songsData = JSON.parse(data);
        setSongsBox(songsData);
    })
    .catch(error => {
        console.error(error);
    });
}

function setSongsBox(songsData) {
    let songsBox = document.getElementById('songsBox');
    songsBox.innerHTML = "";

    let songIndex = -1;

    songsData.forEach(song => {
        addSongButton(song, songsBox, songIndex + 1)
    });
}

function addSongButton(song, element, songIndex) {
    let songButtonDiv = document.createElement('div');
    songButtonDiv.classList.add("song-div");
    songButtonDiv.classList.add("shadow");

    let songInfo = document.createElement('div');
    songInfo.className = "song-info"

    let name = document.createElement('h4');
    name.textContent = song.name

    let artist = document.createElement('p');
    artist.textContent = song.artist

    songInfo.appendChild(name);
    songInfo.appendChild(artist);

    let queueDiv = document.createElement('div');
    let queueButton = document.createElement('h4')
    queueDiv.appendChild(queueButton);

    queueDiv.className = "action-div";

    if (currentPlaylist !== "queue") {
        queueButton.innerText = "Queue";

        queueButton.addEventListener('click', () => {
            addToQueue(song);
        });
    } else {
        queueButton.innerText = "Dequeue";

        queueButton.addEventListener('click', () => {
            removeFromQueue(songIndex);
        });
    }

    songButtonDiv.appendChild(songInfo);
    songButtonDiv.appendChild(queueDiv);

    songButtonDiv.addEventListener('dblclick', () => {
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
        console.error(error);
        element.src = placeHolderImage;
    });
}

function playSong(song) {
    document.getElementById("playingSongName").innerText = song.name;
    document.getElementById("playingSongArtist").innerText = song.artist;
    setImage(song.id, document.getElementById("playingSongImage"))

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
        audioPlayer.src = songURL;
        audioPlayer.load();
        audioPlayer.play();
    })
    .catch(error => {
        console.error(error);
    });
}

function search() {
    let searchInput = document.getElementById("searchInput");
    let substring = searchInput.value;

    searchInput.value = "";

    fetch(`/api/search?substring=${substring}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        let songsData = JSON.parse(data);
        console.log(songsData);

        if (songsData === []) {
            location.reload();
            return
        }

        let songsBox = document.getElementById('songsBox');
        songsBox.innerHTML = "";

        songsData.forEach(song => {
            addSongButton(song, songsBox)
        });
    })
    .catch(error => {
        console.error(error);
    });
}

document.getElementById('audioPlayer').addEventListener('ended', () => {
    if (queueSize === 0) return;
    if (currentPlaylist === "queue") fetchPlaylist("queue");
    playNextInQueue();
});

document.addEventListener(
    "DOMContentLoaded",
    function() {fetchSongLibrary();}
);