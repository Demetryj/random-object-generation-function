/**
 * Generates a random data object based on the provided JSON schema.
 *
 * @param {Object} schema - The JSON schema defining the structure and constraints for the generated data.
 * @returns {any} A randomly generated object or primitive value adhering to the provided JSON schema.
 */
function generateRandomData(schema) {
  /**
   * Generates a random integer within the specified range.
   *
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer between min and max.
   */
  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a random floating-point number within the specified range.
   *
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random floating-point number between min and max.
   */
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generates a random string of the specified length.
   *
   * @param {number} length - The length of the string.
   * @returns {string} A random string of the given length.
   */
  function getRandomString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random boolean value.
   *
   * @returns {boolean} A random boolean value (true or false).
   */
  function getRandomBoolean() {
    return Math.random() < 0.5;
  }

  /**
   * Generates a random array based on the provided schema.
   *
   * @param {Object} schema - The array schema.
   * @returns {Array} A randomly generated array adhering to the schema.
   */
  function generateArray(schema) {
    const minItems = schema.minItems !== undefined ? schema.minItems : 0;
    const maxItems =
      schema.maxItems !== undefined ? schema.maxItems : minItems + 10;

    // If minItems and maxItems are both 0, return an empty array immediately
    if (minItems === 0 && maxItems === 0) {
      return [];
    }

    const uniqueItems = schema.uniqueItems || false;
    const length = getRandomInteger(minItems, maxItems);
    const itemsSchema = schema.items;
    const result = [];

    while (result.length < length) {
      const item = generateData(itemsSchema);
      if (uniqueItems) {
        // Ensure uniqueness by comparing JSON stringified items
        const isUnique = !result.some(
          (existingItem) =>
            JSON.stringify(existingItem) === JSON.stringify(item)
        );
        if (isUnique) {
          result.push(item);
        }
      } else {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Generates a random object based on the provided schema.
   *
   * @param {Object} schema - The object schema.
   * @returns {Object} A randomly generated object adhering to the schema.
   */
  function generateObject(schema) {
    const result = {};
    const properties = schema.properties || {};
    const required = schema.required || [];

    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        // Determine if the property is required
        const isRequired = required.includes(key);
        // Include the property if it's required or randomly decide to include it (70% chance)
        if (isRequired || Math.random() < 0.7) {
          result[key] = generateData(properties[key]);
        }
      }
    }

    return result;
  }

  /**
   * Generates data based on the provided schema segment.
   *
   * @param {Object} schema - A segment of the JSON schema.
   * @returns {any} Randomly generated data adhering to the schema segment.
   */
  function generateData(schema) {
    if (schema.enum) {
      // If enum is defined, randomly select a value from it
      const enumValues = schema.enum;
      return enumValues[getRandomInteger(0, enumValues.length - 1)];
    }

    switch (schema.type) {
      case "integer":
        const intMin =
          schema.minimum !== undefined
            ? schema.minimum
            : Number.MIN_SAFE_INTEGER;
        const intMax =
          schema.maximum !== undefined
            ? schema.maximum
            : Number.MAX_SAFE_INTEGER;
        return getRandomInteger(intMin, intMax);
      case "number":
        const numMin = schema.minimum !== undefined ? schema.minimum : -1e10;
        const numMax = schema.maximum !== undefined ? schema.maximum : 1e10;
        return getRandomNumber(numMin, numMax);
      case "string":
        const minLength = schema.minLength !== undefined ? schema.minLength : 0;
        const maxLength =
          schema.maxLength !== undefined ? schema.maxLength : minLength + 20;
        const length = getRandomInteger(minLength, maxLength);
        return getRandomString(length);
      case "boolean":
        return getRandomBoolean();
      case "array":
        return generateArray(schema);
      case "object":
        return generateObject(schema);
      default:
        return null; // Return null for unknown types
    }
  }

  return generateData(schema);
}

module.exports = generateRandomData;
