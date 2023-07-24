from flask import jsonify

from setup.DataJsonManager import DataJsonManager


class Playlist:
    def __init__(self, name="", songs=None):
        self.name = name

        if songs:
            self.songs = songs
        else:
            self.songs = []

    def add(self, song):
        self.songs.append(song)

    def remove_by_index(self, index):
        self.songs.pop(index)

    def remove(self, song):
        try:
            self.songs.remove(song)
        except ValueError as e:
            print(e)

    def remove_by_song_id(self, song_id):
        for song in self.songs:
            if song.id == song_id:
                self.songs.remove(song)
                return True

        return False

    def has_song_id(self, target_song_id):
        for song in self.songs:
            if song.id == target_song_id:
                return True

        return False

    def save(self):
        DataJsonManager.save_data(self.name, list(self.get_ids()))

    def get_ids(self):
        return [song.id for song in self.songs]

    def get_json(self):
        return jsonify([
            {"id": song.id, "name": song.name, "artist": song.artist}
            for song in self.songs
        ])

    def search(self, substring):
        results = []
        tag_results = []

        substring = substring.lower()

        for song in self.songs:
            if substring in song.name.lower() or substring in song.artist.lower():
                results.append(song)

            elif substring in song.tags:
                tag_results.append(song)

        return Playlist("search_results", results + tag_results)

