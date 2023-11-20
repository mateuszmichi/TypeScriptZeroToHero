// Type Detection

/**
 * Use type narrowing inside if statements to properly check types for the following code.
 */
function Exercise1() {
  const value: unknown = JSON.parse(localStorage.getItem("cacheId") || "");

  if (false) {
    console.log(value.toUpperCase()); // Only strings
  }
  if (false) {
    console.log(value.toFixed()); // Only numbers
  }
  if (false) {
    console.log(value.valueOf()); // Only boolean
  }
}

/**
 * Use type narrowing inside if statements to properly check types for the following code.
 */
function Exercise2() {
  const value: unknown = JSON.parse(localStorage.getItem("cacheId") || "");
  const isValidRequest = (action: "GET" | "POST") => action === "GET";

  if (false) {
    console.log(value); // Only null
  }
  if (false) {
    console.log(value); // Only undefined
  }
  if (typeof value === "string") {
    console.log(isValidRequest(value)); // String - wider type - TS error

    if (false) {
      console.log(isValidRequest(value)); // Only "GET" | "POST" - no TS error
    }
  }
}

// Added declaration for TS to stop complaining
// declare var globalVariable: Array<string> | undefined;

/**
 * Make this function safer.
 * Uncomment line above to remove TS errors.
 */
function Exercise3() {
  if (globalVariable !== undefined) {
    console.log(globalVariable.length);
  }
}

/**
 * Implement the following function.
 */
function Exercise4(x: string[] | number): string {
  // Function should return joined strings with space or input value as fixed number string
}

/**
 * Console.log the age of the author.
 */
function Exercise5(author?: { name: string; age: number } | number | null) {
  // Implement safe handling of different input types
}

/**
 * Safely handle different object types.
 */
function Exercise6() {
  type Author = { name: string; surname: string; books: { title: string }[] };
  type UnknownAuthor = { name: null; books: { title: string }[] };

  function howIsAuthorOfTheBook(
    authors: (Author | UnknownAuthor)[],
    title: string,
  ): string {
    // Return name + surname of matching book by title.
    // If author is not found or unknown, return "Anon"
  }
}

/**
 * Write down results of the following function.
 */
function Exercise7() {
  type A = { x: string };
  type B = { y: string[] };

  function getResult(input: A | B): string {
    if ("y" in input) {
      return input.y.join(" ");
    }
    return input.x;
  }

  const input1 = { x: "value" };
  getResult(input1); // ???
  const input2 = { y: ["some", "value"] };
  getResult(input2); // ???
  const input3 = { x: "example", y: ["value"] };
  getResult(input3); // ???
  const input4 = { x: "example", y: "Hello" };
  getResult(input4); // ???
}

/**
 * Introduce type guards and implement a function that
 * will return full details about an achievement as one string.
 */
function Exercise8() {
  type RecurringAchievement = { title: string; date: Date[] };
  type UniqueAchievement = {
    title: string;
    description: string;
    date: Date;
    place: number;
  };
  type LegendaryAchievement = {
    title: string;
    description: string;
    event: { name: string };
    date: Date;
  };
  type AchievementType =
    | RecurringAchievement
    | UniqueAchievement
    | LegendaryAchievement;

  function getAchievementDetails(achievement: AchievementType): string {
    // Implement the function using type guards
  }
}

/**
 * Return the date as a string.
 */
function Exercise9(
  input: Date | { year: number; month: number; day: number },
): string {
  // Implement the function to handle both Date object and object with year, month, and day properties.
}
