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
