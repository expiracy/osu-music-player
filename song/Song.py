from flask import jsonify


class Song:
    def __init__(self):
        self.id = -1
        self.name = ""
        self.artist = ""
        self.mp3_path = ""
        self.image_path = ""
        self.tags = []

    def get_json(self):
        return jsonify({"id": self.id, "name": self.name, "artist": self.artist})

    def __str__(self):
        return f"{self.artist}: {self.name}"
