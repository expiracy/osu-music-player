from flask import jsonify

from music.SongDataExtractor import SongDataExtractor
from music.Songs import Songs


class App:
    def __init__(self, osu_folder):
        self.songs = Songs()
        self.extractor = SongDataExtractor(f"{osu_folder}/Songs", self.songs)







