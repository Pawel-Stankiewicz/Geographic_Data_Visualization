from flask import Flask, render_template, request
from csv_handler import process_csv
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index_map():
    # Read the CSV file
    df = pd.read_csv('data/12.csv')

    # Get the latitude and longitude values from the CSV
    latitudes = df['LATITUDE'].tolist()
    longitudes = df['LONGITUDE'].tolist()

    # Create a list of marker locations
    locations = []
    for lat, lng in zip(latitudes, longitudes):
        locations.append((lat, lng))

    # Render the map template, passing in the locations and marker color
    return render_template('index.html', locations=locations, marker_color='crimson')

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    if 'csv_file' not in request.files:
        return render_template('index.html', error="No file uploaded")

    csv_file = request.files['csv_file']

    if not csv_file or csv_file.filename == '':
        return render_template('index.html', error="No file uploaded")

    if not csv_file.filename.endswith('.csv'):
        return render_template('index.html', error="Invalid file type")

    # Check the file size and return an error if it is too large
    if csv_file.content_length > 20 * 1024 * 1024:
        return render_template('index.html', error="File is too large (max 20 MB)")


    data = process_csv(csv_file)

    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run()
