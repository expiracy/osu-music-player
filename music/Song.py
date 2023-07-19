class Song:
    def __init__(self, artist="", name="", path=""):
        self.artist = artist
        self.name = name
        self.path = path





    def __str__(self):
        return f"{self.artist}: {self.name}"
