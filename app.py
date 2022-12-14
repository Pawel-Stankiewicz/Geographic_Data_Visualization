from flask import Flask, render_template, request
from csv_handler import process_csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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
