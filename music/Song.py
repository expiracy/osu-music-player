class Song:
    def __init__(self, artist="", name="", mp3_path="", image_path=""):
        self.artist = artist
        self.name = name
        self.mp3_path = mp3_path
        self.image_path = image_path

    def __str__(self):
        return f"{self.artist}: {self.name}"
