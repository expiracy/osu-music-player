from flask import jsonify


class Playlist:
    def __init__(self, songs=None):
        if songs:
            self.songs = songs  # Assumed as queue
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


