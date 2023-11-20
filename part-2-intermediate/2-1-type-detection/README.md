# Type Detection

## Basic Types Narrowing

Narrowing down a union type or broader types like **any** or **unknown** to a more specific type, such as a primitive, is straightforward. The JavaScript **typeof** operator helps in achieving this.

```ts
let value: unknown;

if (typeof value === "string") {
  console.log(value.toUpperCase()); // Value is a string here
}
if (typeof value === "number") {
  console.log(value.toFixed()); // Value is a number here
}
if (typeof value === "boolean") {
  console.log(value.valueOf()); // Value is a boolean
}
```

Using `===` helps in checking for specific values. This is useful to detect specific values from the union type, as well as **null** and **undefined**.

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

There are two ways to check for undefined. In TypeScript, using modern ES syntax, the TypeScript itself checks for variable existence, so we can safely use the `===` approach. The usage of `typeof x === "undefined"` handles undefined global variables. This check is useful for global variables like **window** inside SSR. However, for checking function arguments or declared variables, relying on `=== undefined` is preferable.

```ts
// Executed inside node -> Uncaught ReferenceError: window is not defined
if (window !== undefined) {
  console.log(window);
}
// Safe check for the existence of global variable
if (typeof window !== "undefined") {
  console.log(window);
}
```

## Array Detection

To detect that a variable is an array, we use the built-in utility `Array.isArray`.

```ts
const exampleFunction = (input: string[] | string) => {
  if (Array.isArray(input)) {
    return input.join(" ");
  }
  return input;
};
```

## Object Detection

Detecting an object is a complex topic. Let's start with the basic and naive approach. For general object detection, we use the **typeof** operator and simultaneously check if the value is not null (`typeof null === "object"` - JavaScript as always amuses its users).

```ts
let value: unknown;

if (typeof value === "object") {
  Object.keys(value); // Type 'null' is not assignable to type '{}'
}
if (typeof value === "object" && value !== null) {
  Object.keys(value); // value: object
}
```

This check is useful in many situations. It would be much easier to start checking for other types of variables and be left with the object type at the end:

```ts
const exampleFunction = (user: { name: string } | string | null) => {
  if (typeof user === "string") {
    return user;
  }
  // Now TypeScript knows that user is no longer a string
  // user: { name: string } | null
  if (user === null) {
    return "No user";
  }
  // Finally, we are left with
  // user: { name: string }
  return user.name;
};
```

We learned how to detect an object type in a union containing object types and basic types. There is a problem differentiating between object types inside a tuple. Sometimes we can do it by checking the type of specific keys:

```ts
type A = { x: string; y: string[] };
type B = { x: number; y: string };

function extractY(input: A | B): string {
  if (typeof input.x === "string") {
    // input is still treated as A | B here :(
    return input.y.join(" "); // Error
  }
  if (typeof input.y !== "string") {
    // Only like this we can check the type of the y property
    // input.y is Array here
    return input.y.join(" ");
  }
  return input.y; // Fine because the line above, we know it is a string
}
```

But we can't rely on checking the type of one key to make the whole object type clear for TypeScript. The same problem arises when checking the existence of the key. The trouble comes from the **duck typing** idea that is fundamental to this language. Because TypeScript only checks if the object type matches the general interface (or type), we cannot rely on the absence of properties.

```ts
type A = { x: string };
type B = { y: number };

function getValue(input: A | B): string {
  if ("x" in input) {
    return input.x;
  }
  return input.y.toFixed();
}
```

The code above is not reported as invalid, but it contains possible bugs. Do you see them already? If not, try executing the previously implemented function with the following values:

```ts
// All of the following executions are safe from the TypeScript point of view
getValue({ x: "10" }); // "10"
getValue({ y: 10 }); // "10"
getValue({ x: "20", y: 10 }); // "20" - and it starts to get confusing
const X = { x: 20, y: 10 };
getValue(X); // 20 - and it's not an expected string but a number!
```

As the variable `X` in the final example matches the expected input type, TypeScript does not report any errors, but there is a bug in the code. The final conclusion of this example is that we should not use **in** operator to detect different object shapes, even if TypeScript does not complain about it.

The solution to this problem is introducing a **guard** property inside the union of types that enables us to clearly define the type of the variable. As a guard, we can choose any property, but it is often a key like _type_, _\_type_, _\_guard_, _kind_, etc., based on the type of the objects. After checking for this guard type in an if statement, we are sure about the proper shape of the object.

Example using **strings as guards**:

```ts
type BasicActivity = {
  kind: "basic";
  date: Date;
  score: number;
  techs: number;
};
type TechActivity = {
  kind: "tech";
  date: Date;
  score: { value: number; max: number };
  name: string;
};
type GlobalActivity = { kind: "global"; date: Date; score: number };
type ActivityType = BasicActivity | TechActivity | GlobalActivity;

function handleActivity(activity: ActivityType) {
  if (activity.kind === "basic") {
    // We can safely access all values available for BasicActivity
    const { date, score, techs } = activity;
    console.log(`${date.toISOString()}: Basic activity ${score} on ${techs}`);
  }
  if (activity.kind === "tech") {
    // We can safely access all values available for TechActivity
    const {
      date,
      score: { max, value },
      name,
    } = activity;
    console.log(`${date.toISOString()}: Activity ${value} (${max}) on ${name}`);
  }
  if (activity.kind === "global") {
    // We can safely access all values available for GlobalActivity
    const { date, score } = activity;
    console.log(`${date.toISOString()}: General activity ${score}`);
  }
}
```

Example using **integers as guards**:

```ts
type BasicActivity = { kindId: 0; score: number };
type TechActivity = { kindId: 1; score: { value: number; max: number } };
type ActivityType = BasicActivity | TechActivity;

function handleActivity(activity: ActivityType) {
  if (activity.kindId === 0) {
    // We can safely access all values available for BasicActivity
    console.log(activity.score.toFixed());
    return;
  }
  // Code elimination still works
  // We can safely access all values available for TechActivity
  console.log(activity.score.value, activity.score.max);
}
```

Example using **enums as guards**:

```ts
enum Activity {
  Basic = "basic",
  Tech = "tech",
}
type BasicActivity = { _type: Activity.Basic; score: number };
type TechActivity = {
  _type: Activity.Tech;
  score: { value: number; max: number };
};
type ActivityType = BasicActivity | TechActivity;

function handleActivity(activity: ActivityType) {
  if (activity._type === Activity.Basic) {
    // We can safely access all values available for BasicActivity
  }
  if (activity._type === Activity.Tech) {
    // We can safely access all values available for TechActivity
  }
}
```

and corresponding equivalent using **as const** object:

```ts
const ACTIVITY = {
  Basic: "basic",
  Tech: "tech",
} as const;
type Activity = (typeof ACTIVITY)[keyof typeof ACTIVITY];
type BasicActivity = { _type: typeof ACTIVITY.Basic; score: number };
type TechActivity = {
  _type: typeof ACTIVITY.Tech;
  score: { value: number; max: number };
};
type ActivityType = BasicActivity | TechActivity;

function handleActivity(activity: ActivityType) {
  if (activity._type === ACTIVITY.Basic) {
    // We can safely access all values available for BasicActivity
  }
  if (activity._type === ACTIVITY.Tech) {
    // We can safely access all values available for TechActivity
  }
}
```

Adding guards sometimes introduces a bit more code or increases the payload of the request, but this tool is extremely useful for the type system and should be definitely considered as a go-to pattern.

## Class Detection

Class detection can be achieved using the **instanceof** operator. Do not try to rely on checking properties or methods, as the same rule applies as was shown for using the **in** operator for objects.

```ts
const exampleFunc = (x: Date | XMLHttpRequest) => {
  if (x instanceof Date) {
    // We know x is a Date instance
    console.log(x.toISOString());
  }
  if (x instanceof XMLHttpRequest) {
    // We know x is an XMLHttpRequest instance
    console.log(x.responseURL);
  }
};
```

When using with inheritance, the same rules apply:

```ts
class BaseClass {
  value: string | string[];

  constructor(v: string | string[]) {
    this.value = v;
  }
}

class ExtendedClass extends BaseClass {
  extended: number;

  constructor(v: string | string[]) {
    super(v);
    this.extended = v.length;
  }
}

function testClasses(input: BaseClass | ExtendedClass) {
  if (input instanceof ExtendedClass) {
    console.log(input.extended);
  }
  console.log(input.value);
}
```
