import json
import os


class DataJsonManager:
    json_path = f"{os.getcwd()}\\osu_music_player_data.json"

    def __init__(self):
        data = {}

        # Load the data file if it exists
        try:
            with open(self.json_path, 'r') as file:
                data = json.load(file)

        # Create the data file
        except FileNotFoundError:
            with open(self.json_path, 'w') as file:
                data = {"osu_path": "", "favourites": []}
                json.dump(data, file)

        except Exception as e:
            print(e)

        self.osu_path = data["osu_path"]
        self.favourites = data["favourites"]

        if not self.validate_osu_path(self.osu_path):
            self.osu_path = self.ask_for_osu_path()
            self.save_data("osu_path", self.osu_path)

    def validate_osu_path(self, osu_path):
        try:
            return "Songs" in os.listdir(osu_path)
        except IOError:
            return False

    def ask_for_osu_path(self):
        osu_path = input(
            "Enter exact file path to osu folder "
            "(e.g. C:/Users/{YOUR-USERNAME}/AppData/Local/osu!)"
            "\n>"
        ).strip("/").strip("\\")

        if not self.validate_osu_path(osu_path):
            return self.ask_for_osu_path()

        return osu_path

    @staticmethod
    def save_data(key, value):
        with open(DataJsonManager.json_path, 'r') as file:
            data = json.load(file)
            data[key] = value

        with open(DataJsonManager.json_path, 'w') as file:
            json.dump(data, file)
