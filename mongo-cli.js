#!/usr/bin/env node

// THE ABOVE shebang line allows the script to be run as an executable in Unix-like environments, making it easier to use as a command-line tool. It's a Linux syntax that tells the system to use the Node.js interpreter to run this script.

// Using fs to read the local JSON file(auctionData.json). This approach is better than importing a JSON file directly, as it allows dynamic data loading and avoids bundling issues in production.
import fs from "fs";
// Using mongoose to connect to MongoDB and define schemas
import mongoose from "mongoose";
import dotenv from "dotenv";
// Using chalk for colored console output
import chalk from "chalk";
// Using commander for command-line interface
import { Command } from "commander";
//Import figlet for fancy 80s-style text
import figlet from "figlet";


// import chalk styles from chalkStyles.js
import {
  cyanB,
  green,
  red,
  yellow,
  white,
  magenta,
  bold,
} from "./chalkStyles.js";

dotenv.config();

// Check if MONGO_URI is set in the environment variables
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);


// Display a welcome message using figlet
console.log(
  chalk.magenta(
    figlet.textSync("Mongo CLI Tool", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  )
);

// Initialize the commander program
// This code sets up a command-line interface (CLI) tool to interact with a MongoDB database.
const program = new Command();

// Chaining options for the CLI tool:
// name, description, version, flags, and help instructions
program
  .name(cyanB("mongo-cli-tool"))
  .description(green("A CLI tool to seed or delete data in MongoDB"))
  .version(magenta("1.0.0"))
  .option("--import", yellow("Import data from JSON file into DB"))
  .option("--delete", red("Delete all data from DB"))
  .requiredOption("--file <filename>", "Path to JSON file")
  .requiredOption("--model <model>", "Model name to use")
  .requiredOption("--collection <name>", "MongoDB collection name")
  .addHelpText(
    "after",
    bold(`\nExamples:\n`) +
      `${cyanB("node mongo-cli.js --import --file zstations_transformed.json --model ZStation --collection stations")}\n` +
      `${cyanB("node mongo-cli.js --delete --file zstations_transformed.json --model ZStation --collection stations")}\n`
  )
  // parse method tells commander to parse the command-line arguments and options like --import or --delete
  .parse(); //end of the chain

// after parsing, opts method returns an object containing the parsed options, for example, if the user ran the command with --import, options.import will be true { import: true }.
const options = program.opts();

const modelMap = {
  ZStation: () => import("./models/zStationModel.js").then((m) => m.ZStation),
  // AuctionItem: () => import("./models/auctionModel.js").then((m) => m.AuctionItems),
  // Add more models here as needed
};

if (!modelMap[options.model]) {
  console.error(chalk.red(`❌ Unknown model "${options.model}". Please check your --model value.`));
  process.exit(1);
}

if(!options.import && !options.delete) {
  console.log(chalk.yellow("Specify --import or --delete"));
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const Model = await modelMap[options.model]();

// the conditions tells function which operation to perform based on the flag provided by the user in the command line
if (options.import) {
  await importData(options.file, Model);
} else if (options.delete) {
  await deleteData(Model);
} 

// Data-importing function:
async function importData(file, Model) {
  try {
    // Check if the auctionData.json file exists before attempting to read it
    if (!fs.existsSync(file)) throw new Error(`${file} not found.`);

    const json = JSON.parse(fs.readFileSync(file, "utf-8"));

    const rawData = Array.isArray(json) ? json : json.stations; 
    
    const validData = [];
    let skipped = 0;
    
for (const entry of rawData) {
      const instance = new Model(entry);
      const err = instance.validateSync();
      if (err) {
        console.warn(
          chalk.yellow(`⚠️ Skipping invalid entry:\n${JSON.stringify(entry, null, 2)}\n❌ Reason: ${err.message}\n`)
        );
        skipped++;
      } else {
        validData.push(instance);
      }
    }

    if (validData.length === 0) {
      throw new Error("No valid data to import.");
    }

    await Model.insertMany(validData);

    console.log(chalk.green(`🎉 Successfully imported ${validData.length} item(s).`));
    if (skipped > 0) console.log(chalk.yellow(`⚠️ Skipped ${skipped} invalid item(s).`));
    process.exitCode = 0; // Success exit code
  } catch (error) {
    console.error(chalk.red(`❌ Error importing data: ${error.message}`));
    process.exitCode = 1; // Failure exit code
  } finally {
    await mongoose.disconnect(); // Ensure the database connection is closed
    process.exit();
  }
}

// Data-deleting function:
async function deleteData(Model) {
  try {
    await Model.deleteMany();
    console.log(chalk.green("🗑 All data deleted."));
    process.exitCode = 0; // Success exit code
  } catch (error) {
    console.error(chalk.red(`❌ Failed to delete data: ${error.message}`));
    process.exitCode = 1; // Failure exit code
  } finally {
    await mongoose.disconnect(); // Ensure the database connection is closed
    process.exit();
  }
}

