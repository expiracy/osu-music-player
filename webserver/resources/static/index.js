const placeHolderImage = 'static/images/image-placeholder.jpg';
var queueSize = 0;
var currentPlaylist = "library";
var isLooped = false;

var songIdToFavourite = new Map();

function loop() {
    isLooped = !isLooped

    let loopButton = document.getElementById("loopButton");
    let audioPlayer = document.getElementById("audioPlayer");

    if (isLooped) {
        loopButton.classList.add("clicked");
        audioPlayer.loop = true;
    } else {
        loopButton.classList.remove("clicked");
        audioPlayer.loop = false;
    }
}

function addToQueue(song) {
    fetch(`/api/add_song?song_id=${song.id}&playlist_name=queue`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            queueSize = JSON.parse(data).length;
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
            queueSize -= 1;
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

    let actionDiv = document.createElement('div');
    actionDiv.className = "action-div";

    let queueButton = document.createElement('h4')
    queueButton.className = "underlineOnHover"
    actionDiv.appendChild(queueButton);

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

    let favouriteButton = document.createElement('h4')
    let unfavouriteButton = document.createElement('h4')
    favouriteButton.className = "underlineOnHover"
    unfavouriteButton.className = "underlineOnHover"

    favouriteButton.addEventListener('click', () => {
        favouriteSong(song, favouriteButton, unfavouriteButton)
    });

    unfavouriteButton.addEventListener('click', () => {
        unfavouriteSong(song, favouriteButton, unfavouriteButton)
    });

    actionDiv.appendChild(favouriteButton);
    actionDiv.appendChild(unfavouriteButton);

    fetch(`/api/is_favourite?song_id=${song.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let favourite = JSON.parse(data);

            if (favourite === true) {
                unfavouriteButton.innerText = "Unfavourite"
            } else {
                favouriteButton.innerText = "Favourite"
            }
        })
        .catch(error => {
            console.error(error);
        });

    songButtonDiv.appendChild(songInfo);
    songButtonDiv.appendChild(actionDiv);

    songButtonDiv.addEventListener('dblclick', () => {
        playSong(song)
    });

    element.appendChild(songButtonDiv);
}

function favouriteSong(song, favouriteButton, unfavouriteButton) {
    favouriteButton.innerText = ""
    unfavouriteButton.innerText = "Unfavourite"

    fetch(`/api/add_song?song_id=${song.id}&playlist_name=favourites`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return null;
        })
        .catch(error => {
            console.error(error);
        });
}

function unfavouriteSong(song, favouriteButton, unfavouriteButton) {
    favouriteButton.innerText = "Favourite"
    unfavouriteButton.innerText = ""

    fetch(`/api/remove_song?song_id=${song.id}&playlist_name=favourites&method=song_id`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return null;
        })
        .catch(error => {
            console.error(error);
        });

    if (currentPlaylist === "favourites") fetchPlaylist("favourites");
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
            let imageBlob = new Blob([data], {type: 'image/jpeg'});

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

    document.getElementById("playingLink").setAttribute("href", "https://osu.ppy.sh/beatmapsets/" + song.id + "#osu")

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
            let songBlob = new Blob([data], {type: 'audio/mpeg'});
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

function playNext() {
    if (queueSize === 0) return;
    if (currentPlaylist === "queue") fetchPlaylist("queue");
    playNextInQueue();
}


document.getElementById('audioPlayer').addEventListener('ended', () => {
    playNext()
});

document.addEventListener(
    "DOMContentLoaded",
    () => {
        fetchSongLibrary();
    }
);

document.getElementById("searchInput").addEventListener('keypress',
    () => {
        if (event.key === "Enter") search();
    }
);