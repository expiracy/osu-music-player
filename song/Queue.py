from song.Playlist import Playlist


class Queue(Playlist):
    def __init__(self, queue=None):
        if queue:
            super().__init__("queue", queue)
        else:
            super().__init__()

    def dequeue(self):
        if len(self.songs) > 0:
            return None

        return self.songs.pop(0)
