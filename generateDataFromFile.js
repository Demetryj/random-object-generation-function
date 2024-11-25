const fs = require("fs");
const path = require("path");
const generateRandomData = require("./generateRandomData");

/**
 * Reads a JSON schema from a file and generates random data based on it.
 *
 * @param {string} schemaFilePath - The path to the JSON schema file.
 * @returns {any} Randomly generated data adhering to the schema.
 */
function generateDataFromFile(schemaFilePath) {
  try {
    const absolutePath = path.resolve(schemaFilePath);
    const schemaData = fs.readFileSync(absolutePath, "utf-8");
    const schema = JSON.parse(schemaData);
    return generateRandomData(schema);
  } catch (error) {
    console.error(`Error reading schema from file: ${error.message}`);
    return null;
  }
}

// Example usage
const schemaPath = "./schemas/userSchema.json"; // Change the path to your desired schema
const randomData = generateDataFromFile(schemaPath);
console.log(JSON.stringify(randomData, null, 2));
