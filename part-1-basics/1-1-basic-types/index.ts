// Basic types

// Replace all existing occurrence of this type with proper types
type XYZ = unknown;

// Basic data types
function Exercise1() {
  const price: XYZ = 10.12;
  const description: XYZ = "Total sum";
  const isOverHalf: XYZ = Math.random() > 0.5;
  // Just as remainder, this code does not makes sence :)
  const nullAbleNull: XYZ = null;
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
  // Make this code not throwing error
  function createTuple() {
    const result: XYZ = ["UserName", 100];
    return result;
  }

  const [username, age] = createTuple();
  console.log(username.toLowerCase(), "has age", age.toFixed());
}
