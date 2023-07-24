from flask import jsonify

from setup.SongDataExtractor import SongDataExtractor
from song.Playlist import Playlist
from song.Queue import Queue
from song.SongLibrary import SongLibrary


class SongManager:
    def __init__(self, osu_folder, favourites):
        self.library = SongLibrary()
        self.extractor = SongDataExtractor(f"{osu_folder}/Songs", self.library)

        self.queue = Queue()
        self.favourites = Playlist("favourites", self.ids_to_songs(favourites))

    def ids_to_songs(self, song_ids):
        return [self.library.lookup_song_id(song_id) for song_id in song_ids]

    def get_json_library(self):
        return SongManager.get_json(self.library.get_all())

    def get_json_playlist(self, playlist):
        if playlist == "queue":
            return SongManager.get_json(self.queue.songs)
        elif playlist == "favourites":
            return SongManager.get_json(self.favourites.songs)
        else:
            print(f'No such playlist: {playlist}')

    def add_to_playlist(self, playlist, song_id):
        song = self.library.lookup_song_id(song_id)

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

    @staticmethod
    def get_json(songs):
        return jsonify([
            {"id": song.id, "name": song.name, "artist": song.artist}
            for song in songs
        ])
