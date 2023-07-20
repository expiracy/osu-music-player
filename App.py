from music.SongDataExtractor import SongDataExtractor


class App:
    def __init__(self, osu_folder):
        self.extractor = SongDataExtractor(f"{osu_folder}/Songs").extract()




