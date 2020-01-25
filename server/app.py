from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

DEBUG = True
ZAMATO = "https://developers.zomato.com/api/v2.1/"
ZAMATO_KEY = "9d8d4d6cd40e8783ee21c0eb144dbefa"

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app)


@app.route('/location', methods=['GET'])
def geocoder():
    q = request.args.get('q')

    url = "https://us1.locationiq.com/v1/search.php"

    data = {
        'key': 'f38f675938e025',
        'q': q,
        'format': 'json'
    }

    try:
        response = requests.get(url, params=data)
        d = response.json()
        return jsonify(d[:3])
    except Exception:
        return jsonify([])


@app.route('/options', methods=['GET'])
def get_options():

    lat = request.args.get('lat')
    lon = request.args.get('lon')

    data = {
        "cuisines": cuisines(lat, lon),
        "establishments": establishments(lat, lon),
        "collections": collections(lat, lon)
    }

    return jsonify(data)


# helpers

def cuisines(lat, lon):

    url = ZAMATO + "/cuisines"

    params = {
        "lat": lat,
        "lon": lon
    }

    headers = {
        "user-key": ZAMATO_KEY
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json().get('cuisines', [])


def establishments(lat, lon):

    url = ZAMATO + "/establishments"

    params = {
        "lat": lat,
        "lon": lon
    }

    headers = {
        "user-key": ZAMATO_KEY
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json().get('establishments', [])


def collections(lat, lon):

    url = ZAMATO + "/collections"

    params = {
        "lat": lat,
        "lon": lon
    }

    headers = {
        "user-key": ZAMATO_KEY
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json().get('collections', [])


@app.route('/search', methods=['GET'])
def search():
    url = ZAMATO + "/search"

    headers = {
        "user-key": ZAMATO_KEY
    }

    response = requests.get(url, params=request.args, headers=headers)
    return jsonify(response.json())


if __name__ == '__main__':
    app.run()

# export FLASK_ENV=development && python server/app.py
