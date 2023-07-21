class Song:
    def __init__(self, name="", artist="", mp3_path="", image_path=""):
        self.name = name
        self.artist = artist
        self.mp3_path = mp3_path
        self.image_path = image_path

    def __str__(self):
        return f"{self.artist}: {self.name}"
