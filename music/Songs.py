from flask import jsonify


class Songs:
    def __init__(self):
        self.song_id_to_song = {}

    def search(self, substring):
        results = {}
        substring = substring.lower()

        for song_id, song in self.song_id_to_song.items():
            if substring in song.name.lower() or substring in song.artist.lower():
                results[song_id] = song

        return results

    def add(self, song_id, song):
        self.song_id_to_song[song_id] = song

    def get_all(self):
        return self.song_id_to_song

    @staticmethod
    def jsonify_songs(songs):
        return jsonify([{"id": song_id, "name": song.name, "artist": song.artist} for song_id, song in songs.items()])
