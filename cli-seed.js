// Using fs to read the local JSON file(auctionData.json). This approach is better than importing a JSON file directly, as it allows dynamic data loading and avoids bundling issues in production.
import fs from "fs";
// Using mongoose to connect to MongoDB and define schemas
import mongoose from "mongoose";
import dotenv from "dotenv";
// Using chalk for colored console output
import chalk from "chalk";
// Using commander for command-line interface
import { Command } from "commander";

dotenv.config();

// Initialize the commander program
// This code sets up a command-line interface (CLI) tool to interact with a MongoDB database.
const program = new Command();

// using mongoose to connect to my MongoDB database
await mongoose.connect(process.env.MONGO_URI);

// This schema defines the structure of the auction documents in the MongoDB collection
const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  start_price: Number,
  reserve_price: Number,
});

// Using the schema to create a model for the Auction collection
const AuctionItem = mongoose.model("Auction", auctionSchema);

// Chaining options for the CLI tool:
// name, description, version, flags, and help instructions
program
  .name("mongo-cli-tool")
  .description("A CLI tool to seed or delete data in MongoDB")
  .version("1.0.0")
  .option("--import", "Import data from JSON file into DB")
  .option("--delete", "Delete all data from DB")
  .addHelpText(
    "after",
    `
Examples:
  node cli-seed.js --import
  node cli-seed.js --delete
`
  )
  // parse method tells commander to parse the command-line arguments and options like --import or --delete
  .parse(); //end of the chain

// after parsing, opts method returns an object containing the parsed options, for example, if the user ran the command with --import, options.import will be true { import: true }.
const options = program.opts();

// the conditions tells function which operation to perform based on the flag provided by the user in the command line
if (options.import) {
  await importData();
} else if (options.delete) {
  await deleteData();
} else {
  console.log(chalk.yellow("Please specify an option: --import or --delete"));
}

// Data-importing function:

async function importData() {
  try {
    // Check if the auctionData.json file exists before attempting to read it
    if (!fs.existsSync("auctionData.json")) {
      throw new Error("auctionData.json file not found.");
    }
    const data = JSON.parse(fs.readFileSync("auctionData.json", "utf-8"));
    await AuctionItem.insertMany(data);
    console.log(chalk.green("🎉 Data imported successfully!"));
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
async function deleteData() {
  try {
    await AuctionItem.deleteMany();
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
