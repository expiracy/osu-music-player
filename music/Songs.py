class Songs:
    def __init__(self):
        self.song_id_to_song = {}

    def search_by_substring(self, substring):
        results = []

        for song_id, song in self.song_id_to_song:
            if substring in song.name:
                results.append(song)

        return results

    def add(self, song_id, song):
        self.song_id_to_song[song_id] = song

    def get_all(self):
        return self.song_id_to_song
