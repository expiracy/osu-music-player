class SongLibrary:
    def __init__(self):
        self.song_id_to_song = {}

    def lookup_song_id(self, song_id):
        if song_id not in self.song_id_to_song:
            return None

        return self.song_id_to_song[song_id]

    def add(self, song):
        self.song_id_to_song[song.id] = song

    def get_all(self):
        return list(self.song_id_to_song.values())
