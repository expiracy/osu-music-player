from setup.DataJsonManager import DataJsonManager
from webserver.App import App

if __name__ == "__main__":
    data = DataJsonManager()
    osu_path = data.osu_path
    favourites = data.favourites

    server = App(osu_path, favourites)
    server.run()
