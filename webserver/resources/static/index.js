const placeHolderImage = 'static/images/image-placeholder.jpg';
var queueSize = 0;
var currentPlaylist = "library";
var isLooped = false;

var favouritesSet = new Set();
var audioUrlMap = new Map();
var imageUrlMap = new Map();

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

async function addToQueue(song) {
    try {
        let response = await fetch(`/api/add_song?song_id=${song.id}&playlist_name=queue`);

        if (!response.ok) return;

        queueSize = JSON.parse(await response.text()).length;
        console.log((response));

    } catch (error) {
        console.error(error);
    }
}

async function playNextInQueue() {
    try {
        let response = await fetch(`/api/dequeue`)

        if (!response.ok) return;

        queueSize -= 1;
        let song = JSON.parse(await response.text());
        await playSong(song);

    } catch (error) {
        console.error(error);
    }
}

async function removeFromQueue(songIndex) {
    try {
        let response = await fetch(`/api/remove_song?playlist_name=queue&method=index&index=${songIndex}`)

        if (!response.ok) return;

        let queue = JSON.parse(await response.text());
        queueSize -= 1;

        if (currentPlaylist === "queue") setSongsBox(queue);

    } catch (error) {
        console.error(error);
    }
}

async function fetchPlaylist(playlist) {
    let songs = [];

    try {
        let response = await fetch(`/api/get_playlist?name=${playlist}`)

        if (!response.ok) return songs;

        songs = JSON.parse(await response.text());

    } catch (error) {
        console.log(error)
    }

    return songs;
}

function setSongsBox(songs) {
    let songsBox = document.getElementById('songsBox');
    songsBox.innerHTML = "";
    let songIndex = -1;

    songs.forEach(song => {
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

        queueButton.addEventListener('click',
            async () => {
                await addToQueue(song);
            }
        );
    } else {
        queueButton.innerText = "Dequeue";

        queueButton.addEventListener('click',
            async () => {
                await removeFromQueue(songIndex);
            }
        );
    }

    let favouriteButton = document.createElement('h4');
    favouriteButton.className = "underlineOnHover";
    let unfavouriteButton = document.createElement('h4');
    unfavouriteButton.className = "underlineOnHover";

    favouriteButton.addEventListener('click',
        async () => {
            await addFavourite(song, favouriteButton, unfavouriteButton)
        }
    );

    unfavouriteButton.addEventListener('click',
        async () => {
            await removeFavourite(song, favouriteButton, unfavouriteButton)
        }
    );

    actionDiv.appendChild(favouriteButton);
    actionDiv.appendChild(unfavouriteButton);

    if (favouritesSet.has(song.id))
        unfavouriteButton.innerText = "Unfavourite";
    else
        favouriteButton.innerText = "Favourite";

    songButtonDiv.appendChild(songInfo);
    songButtonDiv.appendChild(actionDiv);

    songButtonDiv.addEventListener('dblclick',
        async () => {
            await playSong(song)
        }
    );

    element.appendChild(songButtonDiv);
}

async function addFavourite(song, favouriteButton, unfavouriteButton) {
    favouriteButton.innerText = ""
    unfavouriteButton.innerText = "Unfavourite"

    favouritesSet.add(song.id);

    try {
        await fetch(`/api/add_song?song_id=${song.id}&playlist_name=favourites`)
    } catch (error) {
        console.error(error);
    }
}

async function removeFavourite(song, favouriteButton, unfavouriteButton) {
    favouriteButton.innerText = "Favourite"
    unfavouriteButton.innerText = ""

    favouritesSet.delete(song.id)

    try {
        let response = await fetch(`/api/remove_song?song_id=${song.id}&playlist_name=favourites&method=song_id`)

        if (!response.ok) return;

        if (currentPlaylist === "favourites") {
            await setSongsBoxPlaylist("favourites");
        }

    } catch (error) {
        console.error(error);
    }
}

async function getMediaUrl(song_id, type) {
    if (type==="image" && imageUrlMap.has(song_id)) return imageUrlMap.get(song_id);
    if (type==="audio" && audioUrlMap.has(song_id)) return audioUrlMap.get(song_id);

    try {
        let response = await fetch(`/api/get_media?song_id=${song_id}&type=${type}`);

        if (!response.ok) return null;

        let blob = await response.blob();
        let mediaUrl = null;

        switch (type) {
            case "audio":
                mediaUrl = URL.createObjectURL(new Blob([blob], {type: 'audio/mpeg'}));
                audioUrlMap.set(song_id, mediaUrl);
                break;
            case "image":
                mediaUrl = URL.createObjectURL(new Blob([blob], {type: 'image/jpeg'}));
                imageUrlMap.set(song_id, mediaUrl);
                break;
        }

        return mediaUrl;

    } catch (error) {
        console.error(error);
    }
}

async function setSongsBoxPlaylist(playlist) {
    currentPlaylist = playlist;
    let songs = await fetchPlaylist(playlist);
    setSongsBox(songs);
}

async function playSong(song) {
    document.getElementById("playingSongName").innerText = song.name;
    document.getElementById("playingSongArtist").innerText = song.artist;

    document.getElementById("playingSongImage").src = await getMediaUrl(song.id, "image");
    document.getElementById("playingLink").href = "https://osu.ppy.sh/beatmapsets/" + song.id + "#osu";

    let audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = await getMediaUrl(song.id, "audio");
    audioPlayer.load();
    audioPlayer.play();
}

async function search() {
    let search_results = [];

    let searchInput = document.getElementById("searchInput");
    let substring = searchInput.value;
    searchInput.value = "";

    try {
        let response = await fetch(`/api/search?substring=${substring}`)

        if (!response.ok) return search_results;

        search_results = JSON.parse(await response.text());

    } catch (error) {
        console.log(error)
    }

    setSongsBox(search_results);
}

async function playNext() {
    if (queueSize === 0) return;

    await playNextInQueue();

    if (currentPlaylist === "queue") {
        await setSongsBoxPlaylist("queue");
    }

}


document.getElementById('audioPlayer').addEventListener('ended',
    async () => {
        await playNext()
    }
);

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        let favourites = await fetchPlaylist("favourites");

        favourites.forEach(song => {
            favouritesSet.add(song.id);
        });

        await setSongsBoxPlaylist("library");
    }
);

document.getElementById("searchInput").addEventListener('keypress',
    async () => {
        if (event.key === "Enter")
            await search();
    }
);