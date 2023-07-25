from setup.DataJsonManager import DataJsonManager
from song.SongManager import SongManager
from webserver.App import App

if __name__ == "__main__":
    data = DataJsonManager()
    song_manager = SongManager(data.osu_path, data.favourites)

    server = App(song_manager)
    server.run()
