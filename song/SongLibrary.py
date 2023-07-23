class SongLibrary:
    def __init__(self):
        self.song_id_to_song = {}

    def search(self, substring):
        results = []
        tag_results = []
        substring = substring.lower()

        for song_id, song in self.song_id_to_song.items():
            if substring in song.name.lower() or substring in song.artist.lower():
                results.append(song)

            elif substring in song.tags:
                tag_results.append(song)

        return results + tag_results

    def add(self, song):
        self.song_id_to_song[song.id] = song

    def get_all(self):
        return list(self.song_id_to_song.values())
