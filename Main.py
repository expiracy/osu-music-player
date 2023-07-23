from setup.OsuPathManager import OsuPathManager
from webserver.Webserver import Webserver

if __name__ == "__main__":
    osu_path = OsuPathManager().osu_path
    server = Webserver(osu_path)
    server.run()
