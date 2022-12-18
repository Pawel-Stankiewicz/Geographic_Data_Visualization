from flask import Flask, render_template, request
from csv_handler import process_csv
import csv
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index_map():
    # Read the CSV file
    with open('data/12.csv') as f:  # f is a file object
        reader = csv.DictReader(f)

        # Store the data in a list
        data = []
        for row in reader:
            data.append(row)

        # Get the numerical attributes from the CSV
        numerical_attributes = []
        for key in data[0].keys():
            try:
                float(data[0][key]) # Try to convert the value to a float
                numerical_attributes.append(key)
            except ValueError:
                pass

        # Render the template, passing in the data and numerical attributes
        return render_template('index.html', data=data, numerical_attributes=numerical_attributes)
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

    return render_template('index.html', data_dict=data)

if __name__ == '__main__':
    app.run()
