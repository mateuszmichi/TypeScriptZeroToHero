// Generic functions

import { Template, sendEmail } from "./externalLibMock";

/*
  For each function, there are some basic unit tests added.
  To run them, install the node modules using `yarn install`
  and run the following command inside the terminal (root of project):
  `TODO`
*/

/**
 * Create a generic function that will return the passed value as a promise.
 * Extra consideration: what should be done with passed Promises?
 */
export function Exercise1(value) {
  // Your implementation here
}

/**
 * Create a generic function that will send emails.
 * The function should accept a template that generates content based on the arguments.
 * It should only accept arguments that match the template and a list of recipients.
 * The function should return a promise with messageIds (strings).
 *
 * Use Template and sendEmail imported from the './externalLibraryMock' file.
 */
export function Exercise2(template, data, recipients) {
  // Your implementation here
}

/**
 * Create a generic function that will format a list to another type.
 * The function should accept a list of items of a specific type
 * and a function that maps items of the input type to the return type.
 */
export function Exercise3(items, mapper) {
  // Your implementation here
}

/**
 * Create a generic function that will compare two objects (a, b) of the same shape.
 * The function should return an object with the following keys:
 * - common: {} // Object that will contain keys of the same value
 * - added: {} // Object that will contain keys not present in a, but present in b
 * - deleted: {} // Object that will contain keys present in a, but not present in b
 * - modified: {
 *   [key]: { prev: valueFromA, next: valueFromB }
 * }
 * Treat undefined and missing keys as the same (for simplicity).
 */
export function Exercise4(a, b) {
  // Your implementation here
}

/**
 * Create a generic function that will create a basic state machine.
 * Each state will be a key inside the type.
 * If the key has an empty object, then no data is needed to go to that step.
 * If the key has an object type, that kind of data is needed to move to that step.
 *
 * The function should accept an initial state.
 * It should return two functions:
 * - getState: returns current state
 * - move: will change the step to the desired one
 *
 * See usage example below - we are going to use step keyguard technique.
 */
export function Exercise5(initialState) {
  // Your implementation here
}

/*
  // Usage idea:

  type StateMachine = {
    init: {};
    loading: { timeout: number };
    submit: { id: number; username: string };
    confirmation: { success: boolean };
    error: {};
  }
  const { move, getState } = Exercise5<StateMachine>({ step: "init" });
  move({ step: "loading", data: { timeout: 300 } });
  move({ step: "submit", data: { id: 102, username: "mocked" } });
  move({ step: "confirmation", data: { success: false } });
  getState(); // would return { step: "confirmation", data: { success: false } }
  move({ step: "error" });
  getState(); // would return { step: "error" }
*/
