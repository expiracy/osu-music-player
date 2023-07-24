from setup.DataJsonManager import DataJsonManager
from song.SongManager import SongManager
from webserver.App import App

if __name__ == "__main__":
    data = DataJsonManager()
    osu_path = data.osu_path
    favourites = data.favourites

    song_manager = SongManager(osu_path, favourites)

    server = App(song_manager)
    server.run()
