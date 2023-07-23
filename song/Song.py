from flask import jsonify


class Song:
    def __init__(self, id=-1, name="", artist="", mp3_path="", image_path=""):
        self.id = id
        self.name = name
        self.artist = artist
        self.mp3_path = mp3_path
        self.image_path = image_path

    def get_json(self):
        return jsonify({"id": self.id, "name": self.name, "artist": self.artist})

    def __str__(self):
        return f"{self.artist}: {self.name}"
