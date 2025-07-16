# Mongo CLI Tool

A Node.js command-line interface tool that allows data seeding and deletion in MongoDB databases.

![Mongo CLI Tool Banner](./Mongo-cli.png)

## 📋 About The Project

This CLI tool works directly from your terminal. It provides two primary functionalities:
- **Import data** from JSON files to your MongoDB collections
- **Delete documents** from selected MongoDB collections

The tool includes validation to ensure only valid data is imported, with detailed logging and error reporting.

## ⚙️ Prerequisites

- Node.js (v14.0.0 or higher)
- npm
- MongoDB connection (local or remote)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mongo-cli-tool.git
cd mongo-cli-tool
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your MongoDB connection string:
```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/yourdb
```

4. Make the CLI executable (Unix/Linux/macOS):
```bash
chmod +x mongo-cli.js
```

## 📖 Usage

### Basic Commands

```bash
node mongo-cli.js --help
```

### Required Parameters

- `--file <filename>`: Path to JSON file
- `--model <model>`: Model name to use (e.g., ZStation)
- `--collection <name>`: MongoDB collection name

### Import Data

```bash
node mongo-cli.js --import --file data.json --model ZStation --collection stations
```

### Delete Data

```bash
node mongo-cli.js --delete --file data.json --model ZStation --collection stations
```

### Examples

```bash
# Import Z-Stations data
node mongo-cli.js --import --file zstations_transformed.json --model ZStation --collection stations

# Delete all Z-Stations data
node mongo-cli.js --delete --file zstations_transformed.json --model ZStation --collection stations
```

## 🔧 Features

- **Data validation** before import
- **Colorful console output** for better readability
- **Detailed error reporting**
- **Progress tracking** during operations

## 📝 Available Models

Currently, the following models are supported:

- `ZStation` - for fuel station data

To add more models, update the `modelMap` object in `mongo-cli.js`.

## 🛠️ Extending the Tool

To add new models:

1. Create a new model file in the `models` directory
2. Add the model to the `modelMap` object in `mongo-cli.js`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Erekle Sesiashvili - [GitHub](https://github.com/smesi36)