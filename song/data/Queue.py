from song.data.Playlist import Playlist
from song.data.Song import Song


class Queue(Playlist):
    def __init__(self, queue=None):
        self.current_index = 0

        if queue:
            super().__init__(queue)
        else:
            super().__init__()

    def add(self, song):
        self.songs.append(song)

    def dequeue(self):
        if len(self.songs) == 0:
            return Song()

        return self.songs.pop(0)


