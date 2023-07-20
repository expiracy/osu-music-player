from music.Song import Song
from music.OsuFileParser import OsuFileParser
import os


class SongDataExtractor:
    def __init__(self, path):
        self.path = path

        self.song_ids = []
        self.song_id_to_song = {}

    def get_songs(self):
        return {song_id: self.song_id_to_song[song_id] for song_id in self.song_ids}

    def extract(self):
        song_folders = os.listdir(self.path)

        for song_folder in song_folders:
            song_folder_contents = os.listdir(f"{self.path}/{song_folder}")

            song = Song()

            for file_name in song_folder_contents:
                lower_file_name = file_name.lower()

                if not song.image_path and (lower_file_name.endswith(".jpg") or
                                            lower_file_name.endswith("png") or
                                            lower_file_name.endswith(".jpeg")):

                    song.image_path = f"{self.path}/{song_folder}/{file_name}"

                if not file_name.endswith("osu"):
                    continue

                beatmap_data = OsuFileParser(f"{self.path}/{song_folder}/{file_name}").data  # Closes the file

                # Robust way of extracting song id
                beatmap_id = int(song_folder.split(' ')[0])

                # Initialise variables for song
                if not song.artist and not song.name and not song.mp3_path:
                    self.song_ids.append(beatmap_id)

                    song.artist = beatmap_data["Artist"]
                    song.name = beatmap_data["Title"]
                    song.mp3_path = f"{self.path}/{song_folder}/{beatmap_data['AudioFilename']}"

                self.song_id_to_song[beatmap_id] = song

        return self








