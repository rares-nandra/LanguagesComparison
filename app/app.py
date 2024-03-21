from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess
import os

from Utilities.LanguagesManager import LanguagesManager

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, debug=True, cors_allowed_origins='*', async_handlers=True)
current_directory = os.path.dirname(os.path.abspath(__file__))
languages_manager = LanguagesManager(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Languages"), "Config.json")

def compilation_status_updater(result):
    emit("COMPILATION_UPDATE", result)

def run_status_updater(result):
    emit("RUN_UPDATE", result)

@app.route("/")
def index():
    languages = languages_manager.get_url_and_paths()
    return render_template("index.html", languages=languages)

for url_and_path in languages_manager.get_url_and_paths():
    def language_page(url_and_path=url_and_path):
        if os.path.isfile(url_and_path["Path"]):
            with open(url_and_path["Path"], 'r') as file:
                file_content = file.read()
            return Response(file_content, content_type='text/plain; charset=utf-8')
        else:
            return "File for: " + url_and_path["url"] + " not found", 404
    
    function_name = f"language_page_{url_and_path['url']}"
    app.add_url_rule(f"/language/{url_and_path['url']}", function_name, language_page)


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on_error() 
def error_handler(e):
    print("An error occurred:", e)

@socketio.on('COMPILATION_START')
def start_compilation(message):
    if message == True:
        result = languages_manager.compile_all(update_callback=compilation_status_updater)
        emit("COMPILATION_ENDED", result)

@socketio.on('RUN_START')
def start_compilation(message):
    if message == True:
        result = languages_manager.run_all(update_callback=run_status_updater)
        emit("RUN_ENDED", result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)