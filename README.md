# JSON Schema-Based Random Object Generator

This project contains a JavaScript function to generate random data objects based on a provided JSON schema. All constraints defined in the schema (data types, minimum/maximum values, required properties, etc.) are strictly adhered to. The implementation uses CommonJS modules and Jest for testing.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Passing Schema as a JavaScript Object](#1-passing-schema-as-a-javascript-object)
  - [Passing Schema from a JSON File](#2-passing-schema-from-a-json-file)
    - [Creating a Schemas Folder](#21-creating-a-schemas-folder)
    - [Using the `generateDataFromFile.js` Script](#22-using-the-generatedatafromfilejs-script)
    - [Running the Script](#23-running-the-script)
  - [Using the `generateRandomData` Function in a Script](#3-using-the-generaterandomdata-function-in-a-script)
- [Testing](#testing)
- [Usage Examples](#usage-examples)

## Requirements

- Node.js (for running tests and scripts)
- npm (for package management)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Demetryj/random-object-generation-function
   cd random-object-generation-function
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

## Usage

### 1 Passing Schema as a JavaScript Object

Import the `generateRandomData` function into your project and pass a JSON schema as an argument.

```javascript
const generateRandomData = require("./generateRandomData");

const schema = {
  type: "object",
  required: ["name", "age"],
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 10,
    },
    age: {
      type: "integer",
      minimum: 18,
      maximum: 65,
    },
    email: {
      type: "string",
      format: "email",
    },
  },
};

const randomData = generateRandomData(schema);
console.log(randomData);
```

Sample Output:

```javascript
{
"name": "Alice",
"age": 30,
"email": "randomEmail@example.com"
}
```

### 2. Passing Schema from a JSON File

You can store your schemas in separate JSON files and read them before generating data.

#### 2.1. Creating a Schemas Folder

Create a schemas/ folder in the root of your project and add your JSON schemas.

#### 2.2. Using the `generateDataFromFile.js` Script

```javascript
const generateDataFromFile = require("./generateDataFromFile");

/**
 * Usage of the function to read a schema from a file and generate data.
 */
const schemaPath = "./schemas/userSchema.json"; // Specify the desired schema
const randomData = generateDataFromFile(schemaPath);
console.log(JSON.stringify(randomData, null, 2));
```

#### 2.3. Running the Script

```bash
  node generateDataFromFile.js
```

Sample Output:

```json
{
  "user": {
    "username": "johnDoe",
    "password": "securePass123",
    "profile": {
      "age": 25,
      "interests": ["coding", "music", "gaming"]
    }
  },
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

### 3. Using the `generateRandomData` Function in a Script

You can use the function directly in any script by loading the schema from a file.

```javascript
const generateRandomData = require("./generateRandomData");
const fs = require("fs");
const path = require("path");

/**
 * Loads a schema from a file.
 * @param {string} filePath - Path to the schema file.
 * @returns {Object} JSON schema.
 */
function loadSchemaFromFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const schemaData = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(schemaData);
}

const schema = loadSchemaFromFile("./schemas/userSchema.json");
const randomData = generateRandomData(schema);
console.log(randomData);
```

Sample Output:

```json
{
  "user": {
    "username": "janeDoe",
    "password": "strongPassword456",
    "profile": {
      "age": 28,
      "interests": ["reading", "traveling"]
    }
  },
  "settings": {
    "theme": "light",
    "notifications": false
  }
}
```

## Testing

**Running Tests**

After setting up all schema files and writing unit tests, you can run the tests using the following command:

```bush
npm test
```

**Test Coverage**

Unit tests should fully cover all data types and constraints supported by the JSON schema, including:

- Type Matching: Ensuring generated data matches the expected type.
- Constraint Adherence: Verifying generated data respects constraints like minimum/maximum values, string lengths, and required properties.
- Edge Cases: Testing behavior under extreme scenarios such as maximum array lengths, boundary numeric values, and absence of optional properties.
- Consistency: Ensuring the function reliably generates data that conforms to the schema across multiple test runs.

## Usage Examples

**Example 1: Generating an Object with Primitive Types**

Schema: schemas/objectSchema.json

```json
{
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "maximum": 1000
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50
    },
    "active": {
      "type": "boolean"
    }
  }
}
```

Usage Script:

```javascript
const generateRandomData = require("./generateRandomData");
const schema = require("./schemas/objectSchema.json");

const randomObject = generateRandomData(schema);
console.log(randomObject);
// Sample Output: { id: 456, name: 'John Doe', active: true }
```

**Example 2: Generating an Array with Unique Strings**

Schema: schemas/enumArraySchema.json

```json
{
  "type": "array",
  "minItems": 2,
  "maxItems": 4,
  "items": {
    "type": "string",
    "enum": ["apple", "banana", "cherry"]
  }
}
```

Usage Script:

```javascript
const generateRandomData = require("./generateRandomData");
const schema = require("./schemas/enumArraySchema.json");

const randomArray = generateRandomData(schema);
console.log(randomArray);
// Sample Output: ['apple', 'cherry']
```

**Example 3: Generating Nested Objects and Arrays**

Schema: schemas/userSchema.json

```json
{
  "type": "object",
  "required": ["user", "settings"],
  "properties": {
    "user": {
      "type": "object",
      "required": ["username", "password"],
      "properties": {
        "username": {
          "type": "string",
          "minLength": 5,
          "maxLength": 12
        },
        "password": {
          "type": "string",
          "minLength": 8,
          "maxLength": 16
        },
        "profile": {
          "type": "object",
          "properties": {
            "age": {
              "type": "integer",
              "minimum": 18,
              "maximum": 99
            },
            "interests": {
              "type": "array",
              "minItems": 1,
              "maxItems": 5,
              "items": {
                "type": "string",
                "minLength": 3,
                "maxLength": 20
              }
            }
          }
        }
      }
    },
    "settings": {
      "type": "object",
      "properties": {
        "theme": {
          "type": "string",
          "enum": ["dark", "light"]
        },
        "notifications": {
          "type": "boolean"
        }
      }
    }
  }
}
```

Usage Script:

```javascript
cgitonst generateRandomData = require("./generateRandomData");
const schema = require("./schemas/userSchema.json");

const randomNestedObject = generateRandomData(schema);
console.log(JSON.stringify(randomNestedObject, null, 2));
// Sample Output:
// {
//     "user": {
//         "username": "johnDoe",
//         "password": "securePass123",
//         "profile": {
//             "age": 25,
//             "interests": ["coding", "music", "gaming"]
//         }
//     },
//     "settings": {
//         "theme": "dark",
//         "notifications": true
//     }
// }
```
