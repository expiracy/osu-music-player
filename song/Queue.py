from song.Playlist import Playlist
from song.Song import Song


class Queue(Playlist):
    def __init__(self, queue=None):
        if queue:
            super().__init__("queue", queue)
        else:
            super().__init__()

    def dequeue(self):
        if len(self.songs) == 0:
            return Song()

        return self.songs.pop(0)
