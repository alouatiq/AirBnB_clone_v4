#!/usr/bin/python3
"""Starts a Flask web application"""

from flask import Flask, render_template
from models import storage
from uuid import uuid4

app = Flask(__name__)

@app.teardown_appcontext
def close_db(exception):
    """Closes storage"""
    storage.close()

@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """Render the 101-hbnb.html template"""
    cache_id = str(uuid4())  # Generate a unique cache ID
    states = storage.all("State")
    amenities = storage.all("Amenity")
    return render_template('101-hbnb.html',
                           states=states,
                           amenities=amenities,
                           cache_id=cache_id)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
