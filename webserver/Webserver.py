from flask import Flask, send_file, render_template, request

from song.SongManager import SongManager


class Webserver:
    def __init__(self, path):
        self.song_manager = SongManager(path)
        self.webserver = Flask(__name__, template_folder='resources', static_folder='resources/static/')
        self.register_routes()

    def register_routes(self):
        self.webserver.route('/')(self.index)
        self.webserver.route('/api/get_library', methods=['GET'])(self.get_library)
        self.webserver.route('/api/get_media', methods=['POST', 'GET'])(self.get_media)
        self.webserver.route('/api/get_playlist', methods=['POST', 'GET'])(self.get_playlist)
        self.webserver.route('/api/search', methods=['POST', 'GET'])(self.search)
        self.webserver.route('/api/dequeue', methods=['GET'])(self.dequeue)
        self.webserver.route('/api/add_song', methods=['POST', 'GET'])(self.add_song)
        self.webserver.route('/api/remove_song', methods=['POST', 'GET'])(self.remove_song)

    def get_media(self):
        try:
            song_id = int(request.args.get('song_id'))
        except ValueError as e:
            print(e)
            return "Song ID not an int"

        if song_id not in self.song_manager.library.song_id_to_song:
            return "Song ID not found"

        media_type = request.args.get('type')

        if media_type == "image":
            return send_file(self.song_manager.library.song_id_to_song[song_id].image_path, as_attachment=True)
        elif media_type == "audio":
            return send_file(self.song_manager.library.song_id_to_song[song_id].mp3_path, as_attachment=True)
        else:
            return "Invalid media type"

    def dequeue(self):
        return self.song_manager.queue.dequeue().get_json()

    def get_library(self):
        return self.song_manager.get_json_library()

    def get_playlist(self):
        name = str(request.args.get('name'))
        return self.song_manager.get_json_playlist(name)

    def search(self):
        substring = str(request.args.get('substring'))
        songs = self.song_manager.library.search(substring)
        return SongManager.get_json(songs)

    def add_song(self):
        try:
            song_id = int(request.args.get('song_id'))
        except ValueError as e:
            print(e)
            return "Song ID not an int"

        playlist_name = str(request.args.get('playlist_name'))
        self.song_manager.add_to_playlist(playlist_name, song_id)

        return str(len(self.song_manager.queue.songs))

    def remove_song(self):
        method = request.args.get('method')

        if method != "index":
            return "Not supported"

        try:
            index = int(request.args.get('index'))
        except ValueError as e:
            print(e)
            return "Index not an int"

        playlist_name = str(request.args.get('playlist_name'))

        self.song_manager.remove_index_from_playlist(playlist_name, index)

        return self.song_manager.get_json_playlist(playlist_name)

    def index(self):
        return render_template('index.html')

    def run(self):
        self.webserver.run(port=727)
