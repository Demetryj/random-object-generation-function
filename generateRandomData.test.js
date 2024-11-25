const fs = require("fs");
const path = require("path");
const generateRandomData = require("./generateRandomData");

/**
 * Helper function to read a schema file.
 *
 * @param {string} fileName - The name of the schema file.
 * @returns {Object} The parsed JSON schema object.
 */
function loadSchema(fileName) {
  const schemaPath = path.resolve(__dirname, "schemas", fileName);
  const schemaData = fs.readFileSync(schemaPath, "utf-8");
  return JSON.parse(schemaData);
}

describe("generateRandomData", () => {
  /**
   * Test generating an integer within a specified range.
   * Purpose: Ensure the function generates an integer between 10 and 20.
   */
  test("generates an integer within the specified range", () => {
    const schema = loadSchema("integerSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("number");
    expect(Number.isInteger(data)).toBe(true);
    expect(data).toBeGreaterThanOrEqual(10);
    expect(data).toBeLessThanOrEqual(20);
  });

  /**
   * Test generating a string with constrained length.
   * Purpose: Ensure the function generates a string with length between 5 and 10 characters.
   */
  test("generates a string with constrained length", () => {
    const schema = loadSchema("stringSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("string");
    expect(data.length).toBeGreaterThanOrEqual(5);
    expect(data.length).toBeLessThanOrEqual(10);
  });

  /**
   * Test generating a floating-point number within a specified range.
   * Purpose: Ensure the function generates a number between 0.5 and 10.5.
   */
  test("generates a floating-point number within the specified range", () => {
    const schema = loadSchema("numberSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("number");
    expect(data).toBeGreaterThanOrEqual(0.5);
    expect(data).toBeLessThanOrEqual(10.5);
  });

  /**
   * Test generating a boolean value.
   * Purpose: Ensure the function generates a boolean value (true or false).
   */
  test("generates a boolean value", () => {
    const schema = loadSchema("booleanSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("boolean");
  });

  /**
   * Test generating an array with unique elements.
   * Purpose: Ensure the function generates an array with unique integers between 1 and 100.
   */
  test("generates an array with unique elements", () => {
    const schema = loadSchema("uniqueArraySchema.json");
    const data = generateRandomData(schema);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(3);
    expect(data.length).toBeLessThanOrEqual(5);
    const unique = new Set(data);
    expect(unique.size).toBe(data.length);
    data.forEach((item) => {
      expect(typeof item).toBe("number");
      expect(Number.isInteger(item)).toBe(true);
      expect(item).toBeGreaterThanOrEqual(1);
      expect(item).toBeLessThanOrEqual(100);
    });
  });

  /**
   * Test generating an object with required properties.
   * Purpose: Ensure the function generates an object with 'id', 'name', and optionally 'active' properties.
   */
  test("generates an object with required properties", () => {
    const schema = loadSchema("objectSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("object");
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    // 'active' can be present or not
    if (data.active !== undefined) {
      expect(typeof data.active).toBe("boolean");
    }
    expect(typeof data.id).toBe("number");
    expect(Number.isInteger(data.id)).toBe(true);
    expect(data.id).toBeGreaterThanOrEqual(1);
    expect(data.id).toBeLessThanOrEqual(1000);
    expect(typeof data.name).toBe("string");
    expect(data.name.length).toBeGreaterThanOrEqual(3);
    expect(data.name.length).toBeLessThanOrEqual(50);
  });

  /**
   * Test generating a string based on enum.
   * Purpose: Ensure the function generates a string that is one of ['red', 'green', 'blue'].
   */
  test("generates data based on enum for string", () => {
    const schema = loadSchema("enumStringSchema.json");
    const data = generateRandomData(schema);
    expect(["red", "green", "blue"]).toContain(data);
  });

  /**
   * Test generating an integer based on enum.
   * Purpose: Ensure the function generates an integer that is one of [10, 20, 30].
   */
  test("generates integer based on enum", () => {
    const schema = loadSchema("enumIntegerSchema.json");
    const data = generateRandomData(schema);
    expect([10, 20, 30]).toContain(data);
  });

  /**
   * Test generating a boolean based on enum.
   * Purpose: Ensure the function always generates true since enum contains only [true].
   */
  test("generates boolean based on enum", () => {
    const schema = loadSchema("enumBooleanSchema.json");
    const data = generateRandomData(schema);
    expect(data).toBe(true);
  });

  /**
   * Test generating an array with enum elements.
   * Purpose: Ensure the function generates an array of strings, each being one of ['apple', 'banana', 'cherry'].
   */
  test("generates an array with enum elements", () => {
    const schema = loadSchema("enumArraySchema.json");
    const data = generateRandomData(schema);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
    expect(data.length).toBeLessThanOrEqual(4);
    data.forEach((item) => {
      expect(["apple", "banana", "cherry"]).toContain(item);
    });
  });

  /**
   * Test generating an object based on enum.
   * Purpose: Ensure the function generates an object that matches one of the enumerated options.
   */
  test("generates object based on enum", () => {
    const schema = loadSchema("enumObjectSchema.json");
    const data = generateRandomData(schema);
    expect([
      { role: "admin" },
      { role: "user" },
      { role: "guest" },
    ]).toContainEqual(data);
  });

  /**
   * Test handling empty arrays when minItems is zero.
   * Purpose: Ensure the function generates an empty array when both minItems and maxItems are zero.
   */
  test("handles empty arrays when minItems is zero", () => {
    const schema = loadSchema("emptyArraySchema.json");
    const data = generateRandomData(schema);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  /**
   * Test generating an object without optional properties.
   * Purpose: Ensure the function can generate an object without the optional 'optionalProp' property.
   */
  test("generates an object without optional properties", () => {
    const schema = loadSchema("optionalObjectSchema.json");
    const data = generateRandomData(schema);
    // 'optionalProp' may or may not be present
    if (data.optionalProp !== undefined) {
      expect(typeof data.optionalProp).toBe("boolean");
    }
  });

  /**
   * Test for consistency over multiple generations.
   * Purpose: Ensure the function consistently generates integers between 10 and 20 over 100 iterations.
   */
  test("consistency over multiple generations", () => {
    const schema = loadSchema("integerSchema.json");
    for (let i = 0; i < 100; i++) {
      const data = generateRandomData(schema);
      expect(typeof data).toBe("number");
      expect(Number.isInteger(data)).toBe(true);
      expect(data).toBeGreaterThanOrEqual(10);
      expect(data).toBeLessThanOrEqual(20);
    }
  });

  /**
   * Test generating an object with nested objects and arrays.
   * Purpose: Ensure the function generates a complex object with nested structures according to the schema.
   */
  test("generates an object with nested objects and arrays", () => {
    const schema = loadSchema("userSchema.json");
    const data = generateRandomData(schema);
    expect(typeof data).toBe("object");
    expect(data).toHaveProperty("user");
    expect(data).toHaveProperty("settings");

    // Check 'user' object
    expect(typeof data.user).toBe("object");
    expect(data.user).toHaveProperty("username");
    expect(data.user).toHaveProperty("password");
    expect(typeof data.user.username).toBe("string");
    expect(data.user.username.length).toBeGreaterThanOrEqual(5);
    expect(data.user.username.length).toBeLessThanOrEqual(12);
    expect(typeof data.user.password).toBe("string");
    expect(data.user.password.length).toBeGreaterThanOrEqual(8);
    expect(data.user.password.length).toBeLessThanOrEqual(16);

    // Check 'profile' object (now required)
    expect(typeof data.user.profile).toBe("object");
    expect(data.user.profile).toHaveProperty("interests");
    expect(typeof data.user.profile.age).toBe("number");
    expect(Number.isInteger(data.user.profile.age)).toBe(true);
    expect(data.user.profile.age).toBeGreaterThanOrEqual(18);
    expect(data.user.profile.age).toBeLessThanOrEqual(99);
    expect(Array.isArray(data.user.profile.interests)).toBe(true);
    expect(data.user.profile.interests.length).toBeGreaterThanOrEqual(1);
    expect(data.user.profile.interests.length).toBeLessThanOrEqual(5);
    data.user.profile.interests.forEach((interest) => {
      expect(typeof interest).toBe("string");
      expect(interest.length).toBeGreaterThanOrEqual(3);
      expect(interest.length).toBeLessThanOrEqual(20);
    });

    // Check 'settings' object
    expect(typeof data.settings).toBe("object");
    if (data.settings.theme) {
      expect(["dark", "light"]).toContain(data.settings.theme);
    }
    if (data.settings.notifications !== undefined) {
      expect(typeof data.settings.notifications).toBe("boolean");
    }
  });
});
