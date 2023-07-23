from webserver.Webserver import Webserver
from setup.OsuPathManager import OsuPathManager

if __name__ == "__main__":
    osu_path = OsuPathManager().osu_path
    server = Webserver(osu_path)
    server.run()
