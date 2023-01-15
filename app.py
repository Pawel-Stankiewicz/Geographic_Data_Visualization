from flask import Flask, redirect, render_template, request
import json
import numpy as np
import pandas as pd
import random
from sqlalchemy import create_engine
import string
from werkzeug.utils import secure_filename


app = Flask(__name__)
app.config['ALLOWED_EXTENSIONS'] = {'csv'}
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024     # maximum size for an incoming file is 20MB

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Generate a unique identifier for the file
        data_id = "".join(random.choices(string.ascii_letters + string.digits, k=9))
        data_id = data_id.lower()

        df = pd.read_csv(file)

        # Connect to the SQLite database
        engine = create_engine('sqlite:///data.db')

        # Store the DataFrame in the database as table with a name = identifier
        df.to_sql(data_id, engine, if_exists='replace', index=False)

        return redirect(f'/map/{data_id}')
    else:
        return "Invalid file type or file size exceeded 20MB"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/map/<data_id>')
def map(data_id):
    # Connect to the SQLite database
    engine = create_engine('sqlite:///data.db')

    df = pd.read_sql_table(data_id, engine)

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

@app.route('/')
def index_map():
    return render_template('map.html')

if __name__ == '__main__':
    app.run()
