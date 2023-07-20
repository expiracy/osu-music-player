import traceback


class OsuFileParser:
    def __init__(self, path):
        self.parsed_headings = {"[General]", "[Metadata]"}
        self.data = {}

        with open(path, "r", encoding="utf8") as file:
            self.parse(file)

    def parse(self, file):
        lines = file.readlines()
        parse_next = False

        for line in lines:

            if line.strip() in self.parsed_headings:
                parse_next = True
                continue

            if not parse_next:
                continue

            if line[0] == '[' or line == '\n':
                parse_next = False
                continue

            if line == "[HitObjects]":
                break

            try:
                split_line = line.split(':')
                self.data[split_line[0]] = split_line[1].strip()

            except:
                print(line)
                traceback.print_exc()
