# Type detection

## Basic types

It is easy to narrow down union type or wider type like **any** or **unknown** to more specific type that is a primitive. We can use JavaScript **typeof** operator to achive this.

```ts
let value: unknown; 

if (typeof value === "string") {
  console.log(value.toUpperCase()); // Value is string here
}
if (typeof value === "number") {
  console.log(value.toFixed()); // Value is number here
}
if (typeof value === "boolean") {
  console.log(value.valueOf()); // Value is boolean
}
```

We can use `===` to check for specific values. This is useful to detect specific values from the union type, but also **null** and **undefined**

```ts
const value: unknown = JSON.parse(localStorage.getItem("cacheId") || "");
// Some helper function
const isValidRequest = (action: "GET" | "POST") => action === "GET";

if (value === null) {
  console.log(value); // Only null
}
if (value === undefined) {
  console.log(value); // Only undefined
}
if (typeof value === "string") {
  console.log(isValidRequest(value)); // String - too wide type - TS error

  if (value === "GET" || value === "POST") {
    console.log(isValidRequest(value)); // Only "GET" | "POST" - no TS error
  }
}
```

There are two ways to check for undefined. Usage of `typeof x === "undefined"` is historical approach that handles undefined global variables. In TypeScript we are using a modern ES syntax and the TypeScript itself is checking for variable existance, so we can safely use `===` aproach.
