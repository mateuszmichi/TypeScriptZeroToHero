// Basic types

// Replace all existing occurrences of this type with proper types
type XYZ = unknown;

// Basic data types
function Exercise1() {
  const price: XYZ = 10.12;
  const description: XYZ = "Total sum";
  const isOverHalf: XYZ = Math.random() > 0.5;
  // Just as a reminder, this code does not make sense :)
  const nullableNull: XYZ = null;
  const undefinedUndefined: XYZ = undefined;
}

// Union types
function Exercise2() {
  const formValue: XYZ = Math.random() > 0.5 ? "10" : 10;

  let userAge: XYZ = null;
  userAge = 23;
  userAge = undefined;

  const direction: XYZ = Math.random() > 0.5 ? "UP" : "DOWN";
}

// Arrays
function Exercise3() {
  const userInputs: XYZ = ["Hello", "World", "My", "Friend"];
  const ages: XYZ = [10, 22, 23, 87, null];
  const todoList: XYZ = ["DONE", "DONE", "WAITING", "BLOCKED"];
}

// Tuples
function Exercise4() {
  // Make this code not throw an error
  function createTuple() {
    const result: XYZ = ["UserName", 100];
    return result;
  }

  const [username, age] = createTuple();
  console.log(username.toLowerCase(), "has an age of", age.toFixed());
}
