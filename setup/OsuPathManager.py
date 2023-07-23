import os


class OsuPathManager:
    def __init__(self):
        self.osu_path = ""

        if self.is_valid_path_saved():
            self.osu_path = self.get_saved_path()
        else:
            self.osu_path = self.ask_for_path()
            self.save_path(self.osu_path)

    def is_valid_path_saved(self):
        try:
            with open(self.get_txt_path(), "r+") as file:
                lines = file.readlines()

                if len(lines) < 1:
                    return False

                if not self.validate_path(lines[0]):
                    return False

                return True

        except IOError:
            return False

    def get_saved_path(self):
        with open(self.get_txt_path(), "r") as file:
            return file.readline()

    def get_txt_path(self):
        return f"{os.getcwd()}\\osu_music_data.txt"

    def validate_path(self, osu_path):
        try:
            return "Songs" in os.listdir(osu_path)
        except IOError as e:
            print(e)

    def save_path(self, osu_path):
        with open(self.get_txt_path(), "w") as file:
            file.truncate(0)
            file.write(osu_path)

    def ask_for_path(self):
        osu_path = input(
            "Enter exact file path to osu folder (eg C:/Users/{YOUR-USERNAME}/AppData/Local/osu!)\n>").strip("/").strip(
            "\\")

        try:
            if not self.validate_path(osu_path):
                return self.ask_for_path()

        except IOError:
            return self.ask_for_path()

        return osu_path
