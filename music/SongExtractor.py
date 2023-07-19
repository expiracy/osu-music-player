from music.Song import Song
from music.OsuFileParser import OsuFileParser
import os


class SongExtractor:
    def __init__(self, path):
        self.path = path

        self.song_ids = []
        self.beatmap_id_to_song = {}

    def extract(self):
        song_folders = os.listdir(self.path)

        for song_folder in song_folders:
            song_folder_contents = os.listdir(f"{self.path}/{song_folder}")

            song = Song()

            for file_name in song_folder_contents:

                if not file_name.endswith(".osu"):
                    continue

                file = open(f"{self.path}/{song_folder}/{file_name}", "r", encoding="utf8")
                beatmap_data = OsuFileParser(file).data  # Closes the file

                # Robust way of extracting song id
                beatmap_id = int(song_folder.split(' ')[0])

                # Initialise variables for song
                if not song.artist and not song.name and not song.path:
                    self.song_ids.append(beatmap_id)

                    song.artist = beatmap_data["Artist"]
                    song.name = beatmap_data["Title"]
                    song.path = f"{self.path}/{song_folder}/{beatmap_data['AudioFilename']}"

                self.beatmap_id_to_song[beatmap_id] = song

        return self








