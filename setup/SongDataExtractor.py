import os

from setup.OsuFileParser import OsuFileParser
from song.Song import Song


class SongDataExtractor:
    def __init__(self, path, songs):
        self.songs = songs
        self.extract(path)

    def extract(self, path):
        song_folders = os.listdir(path)

        for song_folder in song_folders:
            song = Song()

            for file_name in os.listdir(f"{path}/{song_folder}"):

                # Song has all info at this point
                if song.image_path and song.name:
                    break

                # Extract if image
                lower_file_name = file_name.lower()

                if (lower_file_name.endswith(".jpg")
                        or lower_file_name.endswith("png")
                        or lower_file_name.endswith(".jpeg")):
                    song.image_path = f"{path}/{song_folder}/{file_name}"

                # Extract remaining metadata from an .osu file if not already
                if file_name.endswith(".osu"):
                    beatmap_data = OsuFileParser(f"{path}/{song_folder}/{file_name}").data

                    song.id = int(song_folder.split(' ')[0])
                    song.name = beatmap_data["Title"]
                    song.artist = beatmap_data["Artist"]
                    song.mp3_path = f"{path}/{song_folder}/{beatmap_data['AudioFilename']}"

                    self.songs.add(song)

            # When no background image is found, use the placeholder image
            if not song.image_path:
                song.image_path = f"../webserver/resources/static/images/image-placeholder.jpg"

        return self
