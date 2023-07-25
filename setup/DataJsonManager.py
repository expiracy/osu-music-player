import json
import os


class DataJsonManager:

    def __init__(self):
        json_path = DataJsonManager.get_data_json_path()
        try:
            # Load the data file if it exists
            with open(json_path, 'r') as file:
                data = json.load(file)

        except (IOError, ValueError):
            # Resets the file if there were any issues
            with open(json_path, 'w') as file:
                data = {"osu_path": "", "favourites": []}
                json.dump(data, file)

        self.osu_path = data["osu_path"]
        self.favourites = data["favourites"]

        if not DataJsonManager.validate_osu_path(self.osu_path):
            self.osu_path = self.osu_path_setup()
            self.save_data("osu_path", self.osu_path)

    def osu_path_setup(self):
        print("[osu! Path Configuration]")
        print("1. Default osu! folder path location")
        print("2. Manual osu! folder path input")
        choice = input(">")

        if choice == '1':
            osu_path = DataJsonManager.get_default_osu_path()
        elif choice == '2':
            print()
            print("[Manual Configuration]")
            print("Enter exact file path to osu folder")
            print("(e.g. C:/Users/{YOUR-USERNAME}/AppData/Local/osu!)")
            osu_path = input(">").strip("/").strip("\\")
        else:
            return self.osu_path_setup()

        if not DataJsonManager.validate_osu_path(osu_path):
            return self.osu_path_setup()

        print()
        print("[osu! Path Set]")
        print(osu_path)
        print()

        return osu_path

    @staticmethod
    def validate_osu_path(osu_path):
        try:
            return "Songs" in os.listdir(osu_path)
        except IOError:
            return False

    @staticmethod
    def get_data_json_path():
        return f"{os.getcwd()}\\osu_music_player_data.json"

    @staticmethod
    def get_default_osu_path():
        return f"{os.getenv('LOCALAPPDATA')}\\osu!"

    @staticmethod
    def save_data(key, value):
        json_path = DataJsonManager.get_data_json_path()

        with open(json_path, 'r') as file:
            data = json.load(file)
            data[key] = value

        with open(json_path, 'w') as file:
            json.dump(data, file)
