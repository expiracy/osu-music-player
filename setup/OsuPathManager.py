import os


class OsuPathManager:
    def __init__(self):
        self.osu_path = ""

        if not self.is_path_saved():
            self.ask()
            self.save()
        else:
            self.osu_path_save_path()


    def is_path_saved(self):
        try:
            with open(self.get_saved_osu_path(), "r+") as file:
                lines = file.readlines()

                if len(lines) != 1:
                    return False

                self.osu_path = lines[0]

                if not self.validate():
                    return False

                return True
        except IOError as e:
            return False

    def osu_path_save_path(self):
        with open(self.get_saved_osu_path(), "r") as file:
            return file.readline()

    def get_saved_osu_path(self):
        return f"{os.getcwd()}\\osu_path.txt"

    def validate(self):
        try:
            return "Songs" in os.listdir(self.osu_path)
        except IOError as e:
            print(e)

    def save(self):
        with open(self.get_saved_osu_path(), "w") as file:
            file.truncate(0)
            file.write(self.osu_path)

    def ask(self):
        print("[SETUP]")

        self.osu_path = input("Enter exact file path to osu folder (eg C:/Users/{YOURUSERNAME}/AppData/Local/osu!)\n>").strip("/").strip("\\")

        try:
            if not self.validate():
                self.ask()

            return

        except IOError:
            self.ask()

