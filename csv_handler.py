import csv

def process_csv(csv_file):
    data = []

    # Read the CSV file and parse the data
    reader = csv.reader(csv_file)
    for row in reader:
        data.append(row)

    return data
