from music.SongExtractor import SongExtractor


class App:
    def __init__(self, osu_folder):
        self.extractor = SongExtractor(f"{osu_folder}/Songs").extract()
        pass

