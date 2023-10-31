// TypeScript Keywords

import {
  fetchData,
  personalData,
  satisfiesMock,
  standardMock,
} from "./externalLibMock";

type XYZ = unknown;

/**
 * Use the 'as' keyword to remove errors from the code.
 */
function Exercise1() {
  const getValue = (id: number) => (id < 0 ? undefined : "DBConnectionString");

  const connection = getValue(2);
  console.log(`Connecting: ${connection.toLowerCase()}`);
}

/**
 * 1. Make the following function safer - use the 'never' keyword.
 * 2. Add a check to safely handle access to data methods.
 */
function Exercise2() {
  const extractData = () => {
    const stored = localStorage.getItem("data");
    return stored === null ? null : JSON.parse(stored);
  };

  const data = extractData();

  console.log(data.toUpperCase());
}

/**
 * Use the 'never' keyword to safely handle all cases in the code.
 * Uncomment the additional union type to test the code.
 */
function Exercise3() {
  type AnimalType =
    // | 'Fox' // Later uncomment me
    "Dog" | "Cat" | "Bird";

  function whatDoesTheFoxSay(animal: AnimalType) {
    if (animal === "Dog") {
      return "Woof";
    }
    if (animal === "Cat") {
      return "Meow";
    }
    return "Tweet";
  }
}

/**
 * Use 'typeof' to help write a handler
 * and use a proper getter function.
 */
function Exercise4() {
  const handleResponse = (url: string, getter: XYZ) => {
    return getter();
  };

  const response = handleResponse("/someurl", fetchData);
}

/**
 * Use 'typeof' and 'keyof' to provide proper typing
 * for an external object.
 */
function Exercise5() {
  const extractPersonalData = (...keys: XYZ) => {
    let response: XYZ = {};
    keys.forEach((key) => {
      response[key] = personalData[key];
    });
    return response;
  };

  const d1 = extractPersonalData("name");
  const d2 = extractPersonalData("surname", "birthday");
  const d3 = extractPersonalData("address");
}

/**
 * Compare how 'satisfies' changes mock behavior.
 */
function Exercise6() {
  console.log(satisfiesMock.data);
  console.log(standardMock.data);
}
