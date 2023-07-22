from flask import jsonify

from setup.SongDataExtractor import SongDataExtractor
from song.data.Playlist import Playlist
from song.data.Queue import Queue
from song.data.SongLibrary import SongLibrary


class SongManager:
    def __init__(self, osu_folder):
        self.library = SongLibrary()
        self.extractor = SongDataExtractor(f"{osu_folder}/Songs", self.library)

        self.queue = Queue()
        self.current = Playlist(self.library.get_all())
        self.favourites = Playlist()

    def get_json_library(self):
        return SongManager.get_json(self.library.get_all())

    def get_json_playlist(self, playlist):
        if playlist == "queue":
            return SongManager.get_json(self.queue.songs)
        elif playlist == "current":
            return SongManager.get_json(self.current.songs)
        elif playlist == "favourites":
            return SongManager.get_json(self.favourites.songs)
        else:
            print(f'No such playlist: {playlist}')

    def add_to_playlist(self, playlist, song_id):
        if song_id not in self.library.song_id_to_song:
            print(f'No song with ID: {song_id}')
            return

        song = self.library.song_id_to_song[song_id]

        if playlist == "queue":
            self.queue.add(song)
        elif playlist == "current":
            self.current.add(song)
        elif playlist == "favourites":
            self.favourites.add(song)
        else:
            print(f'No such playlist: {playlist}')

    def remove_index_from_playlist(self, playlist, index):
        if playlist == "queue":
            self.queue.remove_by_index(index)
        elif playlist == "current":
            self.current.remove_by_index(index)
        elif playlist == "favourites":
            self.favourites.remove_by_index(index)
        else:
            print(f'No such playlist: {playlist}')

    @staticmethod
    def get_json(songs):
        return jsonify([{"id": song.id, "name": song.name, "artist": song.artist} for song in songs])
