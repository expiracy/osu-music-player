from setup.SongDataExtractor import SongDataExtractor
from song.Playlist import Playlist
from song.Queue import Queue
from song.SongLibrary import SongLibrary


class SongManager:
    def __init__(self, osu_folder, favourites):
        self.songs_store = SongLibrary()
        self.extractor = SongDataExtractor(f"{osu_folder}/Songs", self.songs_store)

        self.queue = Queue()
        self.library = Playlist("library", self.songs_store.get_all())
        self.favourites = Playlist("favourites", self.ids_to_songs(favourites))

    def ids_to_songs(self, song_ids):
        return [self.songs_store.lookup_song_id(song_id) for song_id in song_ids]

    def get_json_playlist(self, playlist):
        if playlist == "library":
            return self.library.get_json()

        elif playlist == "queue":
            return self.queue.get_json()

        elif playlist == "favourites":
            return self.favourites.get_json()

        else:
            print(f'No such playlist: {playlist}')

    def add_to_playlist(self, playlist, song_id):
        song = self.songs_store.lookup_song_id(song_id)

        if not song:
            print(f'No song with ID: {song_id}')
            return

        if playlist == "queue":
            self.queue.add(song)

        elif playlist == "favourites":
            self.favourites.add(song)
            self.favourites.save()

        else:
            print(f'No such playlist: {playlist}')

    def remove_song_id_from_playlist(self, playlist, song_id):
        if playlist == "queue":
            self.queue.remove_by_song_id(song_id)

        elif playlist == "favourites":
            self.favourites.remove_by_song_id(song_id)
            self.favourites.save()

        else:
            print(f'No such playlist: {playlist}')

    def remove_index_from_playlist(self, playlist, index):
        if playlist == "queue":
            self.queue.remove_by_index(index)

        elif playlist == "favourites":
            self.favourites.remove_by_index(index)

        else:
            print(f'No such playlist: {playlist}')
