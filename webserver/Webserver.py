from flask import Flask, send_file, render_template

from App import App


class Webserver:
    def __init__(self):
        self.app = App("C:/Users/james/AppData/Local/osu!")
        self.webserver = Flask(__name__, template_folder='resources', static_folder='resources/static/')
        self.register_routes()

    def register_routes(self):
        self.webserver.route('/index')(self.index)
        self.webserver.route('/get_mp3')(self.get_mp3)
        self.webserver.route('/get_image')(self.get_image)

    def get_mp3(self):
        # Logic to retrieve the MP3 file
        mp3_path = "C:/Users/james/AppData/Local/osu!/Songs/1004468 Parry Gripp - Guinea Pig Bridge/audio.mp3"
        return send_file(mp3_path, mimetype='audio/mpeg')

    def get_image(self):
        # Logic to retrieve the image file
        image_path = 'path_to_your_image_file.png'
        return send_file(image_path, mimetype='image/png')

    def index(self):
        return render_template('home.html')



    def run(self):
        self.webserver.run()

if __name__ == '__main__':
    server = Webserver()
    server.run()