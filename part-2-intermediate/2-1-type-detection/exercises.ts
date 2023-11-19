// Type detection

/**
 * Use type narrowing inside if statements to properly check type for following code
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
 * Use type narrowing inside if statements to properly check type for following code
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
    console.log(isValidRequest(value)); // String - to wider type - TS error

    if (false) {
      console.log(isValidRequest(value)); // Only "GET" | "POST" - no TS error
    }
  }
}
