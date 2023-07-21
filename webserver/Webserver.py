import json

from flask import Flask, send_file, render_template, request, jsonify

from App import App
from music.Songs import Songs


class Webserver:
    def __init__(self):
        self.app = App("C:/Users/james/AppData/Local/osu!")
        self.webserver = Flask(__name__, template_folder='resources', static_folder='resources/static/')
        self.register_routes()

    def register_routes(self):
        self.webserver.route('/')(self.index)
        self.webserver.route('/api/get_media', methods=['POST', 'GET'])(self.get_media)
        self.webserver.route('/api/get_mp3s', methods=['GET'])(self.get_mp3s)
        self.webserver.route('/api/search', methods=['POST', 'GET'])(self.search)

    def get_media(self):
        try:
            song_id = int(request.args.get('song_id'))
        except ValueError:
            return "Song ID not an int"

        if song_id not in self.app.songs.song_id_to_song:
            return "Song ID not found"

        media_type = request.args.get('type')

        if media_type == "image":
            return send_file(self.app.songs.song_id_to_song[song_id].image_path, as_attachment=True)
        elif media_type == "audio":
            return send_file(self.app.songs.song_id_to_song[song_id].mp3_path, as_attachment=True)
        else:
            return "Invalid media type"

    def get_mp3s(self):
        songs = self.app.songs.get_all()
        return Songs.jsonify_songs(songs)

    def search(self):
        substring = str(request.args.get('substring'))
        songs = self.app.songs.search(substring)
        return Songs.jsonify_songs(songs)

    def index(self):
        return render_template('index.html')

    def run(self):
        self.webserver.run()


if __name__ == '__main__':
    server = Webserver()
    server.run()
