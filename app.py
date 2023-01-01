from flask import Flask, render_template, request
from csv_handler import process_csv
import csv
import json
import numpy as np
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index_map():
    # Read data from CSV file
    df = pd.read_csv('data/12.csv')
    # Convert to JSON
    data = df.to_json(orient='records')
    # Get list of numerical attributes. _get_num... returns new DF containing only the numerical columns
    numerical_attributes = [col for col in df._get_numeric_data().columns]

    # Calculate quantile ranges for 1-10 quantiles for each attribute
    all_quantile_ranges = {}
    for attribute in numerical_attributes:
        quantile_ranges = {}
        for i in range(1, 11):  # 1 is the whole range
            # linspace returns evenly spaced i+1 numbers from interval (0, 1)
            # tolist() because quantile returns series - not JSON serializable
            quantile_ranges[i] = df[attribute].quantile(np.linspace(0, 1, i+1)).tolist()
        # Add the quantile ranges for the attribute to the dictionary
        all_quantile_ranges[attribute] = quantile_ranges

    # Convert the quantile ranges to a JSON object for use in the template
    quantile_ranges_json = json.dumps(all_quantile_ranges)


# Pass data to Jinja2 template
    return render_template('map.html', data=data, numerical_attributes=numerical_attributes, quantile_ranges=quantile_ranges_json)

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    if 'csv_file' not in request.files:
        return render_template('map.html', error="No file uploaded")

    csv_file = request.files['csv_file']

    if not csv_file or csv_file.filename == '':
        return render_template('map.html', error="No file uploaded")

    if not csv_file.filename.endswith('.csv'):
        return render_template('map.html', error="Invalid file type")

    # Check the file size and return an error if it is too large
    if csv_file.content_length > 20 * 1024 * 1024:
        return render_template('map.html', error="File is too large (max 20 MB)")


    data = process_csv(csv_file)

    return render_template('map.html', data_dict=data)

if __name__ == '__main__':
    app.run()
