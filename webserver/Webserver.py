import json

from flask import Flask, send_file, render_template, request, jsonify

from App import App


class Webserver:
    def __init__(self):
        self.app = App("C:/Users/james/AppData/Local/osu!")
        self.webserver = Flask(__name__, template_folder='resources', static_folder='resources/static/')
        self.register_routes()

    def register_routes(self):
        self.webserver.route('/')(self.home)
        self.webserver.route('/api/get_media', methods=['POST', 'GET'])(self.get_media)
        self.webserver.route('/api/get_songs', methods=['GET'])(self.get_songs)

    def get_media(self):
        song_id = request.args.get('song_id')

        try:
            song_id = int(song_id)
        except:
            return jsonify(error="Song ID not an int")

        if song_id not in self.app.extractor.song_id_to_song:
            return jsonify(error="Song ID not found")

        media_type = request.args.get('type')

        if media_type == "image":
            return send_file(self.app.extractor.song_id_to_song[song_id].image_path, as_attachment=True)
        elif media_type == "audio":
            return send_file(self.app.extractor.song_id_to_song[song_id].mp3_path, as_attachment=True)
        else:
            return jsonify(error="Invalid type")
    def get_songs(self):
        songs = self.app.extractor.get_songs()
        json_songs = [{"id": song_id, "name": song.name, "artist": song.artist} for song_id, song in songs.items()]
        return jsonify(json_songs)

    def home(self):
        return render_template('home.html')



    def run(self):
        self.webserver.run()

if __name__ == '__main__':
    server = Webserver()
    server.run()