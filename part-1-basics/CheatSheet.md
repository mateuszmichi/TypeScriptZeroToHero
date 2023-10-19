# Basics Cheat Sheet

## Basic Types

### Primitives

In JavaScript, there are a few primitive types that you can use while coding. All of them are reflected inside TypeScript types.

```ts
// Strings
const string: string = "Hello World";

// Numbers - no difference between integers and floats
const number: number = 100;

// True / False values
const bool: boolean = number > 200;
```

There are also more exotic primitives that are rarely used.

```ts
// Symbols
const symbol: symbol = Symbol();

// BigInt support
const big: bigint = BigInt("0x1fffffffffffff");
```

You can use the type null and undefined for variables that accept those values.

```ts
// null
const varWithNull: null = null;

// undefined
const varWithUndefined: undefined = undefined;
```

### Union Types

Sometimes, variables will accept different types depending on the situation. To create a type that can accept a set of types, you will use the `|` union operator.

```ts
let stringOrNumber: string | number = 10;
// This will work properly
stringOrNumber = "10";

const stringOrNull: string | null = Math.random() > 0.5 ? "head" : null;
```

### Using Values as Types

Sometimes, you will need to limit accepted values to specific strings or numbers. You can achieve this using specific values as types. This is especially useful when using values with tuples to allow only a finite set of values.

```ts
let onlyHelloWorld: "Hello" | "World" = "Hello";
// This assignment will cause an error
// onlyHelloWorld = "Other string";

let onlyTrueOrNull: true | null = true;
// This assignment will cause an error
// onlyTrueOrNull = false;

let teamId: 1 | 2 | 3 = 1;
// This assignment will cause an error
// teamId = 4;
```

### Arrays

There are two ways to define arrays in TypeScript, and they are interchangeable.

```ts
// Using [] syntax
const numberList: number[] = [1, 3];
const numberOrStringList: (number | string)[] = [1, 3];
const booleanList: boolean[] = [true, false, true];

// Using Array<> template
const numberList: Array<number> = [1, 3];
const numberOrStringList: Array<number | string> = [1, 3];
const booleanList: Array<boolean> = [true, false, true];
```

### Tuples

When dealing with values that are arrays of always constant size, you can define them as tuples. This prevents accessing non-existing indices and helps when returning arrays with fields of different value types.

```ts
const baseReturnValue = [1, "Username"];
const id = baseReturnValue[0]; // number | string
const user = baseReturnValue[1]; // number | string
const invalid = baseReturnValue[2]; // number | string

const baseReturnValue: [number, string] = [1, "Username"];
const id = baseReturnValue[0]; // number
const user = baseReturnValue[1]; // string
const invalid = baseReturnValue[2]; // This line will cause a TypeScript error
```

## Functions

### Function Types

Most of the typing will occur at the function level since their arguments cannot be auto-detected by static code analysis. That's why proper function typing will be key to a successful typing system for your codebase.

```ts
// Function without arguments returning a number
type GetRandomNumberType = () => number;
const getRandomNumber: GetRandomNumberType = () => {
  return Math.ceil(Math.random() * 100);
};

// Inline declaration
const getRandomNumber2 = () => {
  // TypeScript will know that the result is a number from static code analysis
  return Math.ceil(Math.random() * 100);
};

// Function with one argument returning a number
type RootSquareType = (value: number) => number;
const rootSquare: RootSquareType = (value) => {
  // When using the type RootSquareType, TypeScript will know that 'value' is a number
  return value * value;
};

// Inline declaration
const rootSquare2: RootSquareType = (value: number) => {
  // TypeScript will know that the result is a number from static code analysis
  return value * value;
};

// Different arguments
type MixedArgumentsType = (bookId: number, chapterIds: number[]) => string;
const mixedArguments: MixedArgumentsType = (bookId, chapterIds) => {
  // When using the type MixedArgumentsType, TypeScript will know the types of 'bookId' and 'chapterIds'
  return `Reading book ${bookId}, chapters ${chapterIds.join(", ")}`;
};

// Inline declaration
const mixedArguments2 = (bookId: number, chapterIds: number[]) => {
  // TypeScript will know that the result is a string
  return `Reading book ${bookId}, chapters ${chapterIds.join(", ")}`;
};
```

To mark arguments as optional, use the `?` character.

```ts
// Function with one optional argument returning a string
type WhatIsMyNameType = (surname?: string) => string;
const whatIsMyName: WhatIsMyNameType = (surname) => {
  return `Tom${surname ? ` ${surname}` : ""}`;
};

// Inline declaration
const whatIsMyName2: WhatIsMyNameType = (surname?: string) => {
  return `Tom${surname ? ` ${surname}` : ""}`;
};

// Function with an optional argument with a default value
type WithDefaultValueType = (action?: string) => string;
const executeAction: WithDefaultValueType = (action = "defaultAction") => {
  return `Executing action ${action}`;
};

// Inline declaration
const executeAction2 = (action = "defaultAction") => {
  // TypeScript will assume that 'action' is a string since the default value is a string
  return `Executing action ${action}`;
};

// Function with an optional argument with a default value definition
type WithSpecificDefaultValueType = (action?: "get" | "post") => string;
const executeSpecificAction: WithSpecificDefaultValueType = (
  action = "post",
) => {
  return `Executing action ${action}`;
};

// Inline declaration
const executeAction2 = (action: "get" | "post" = "post") => {
  // When providing a default value, do not use '?' when providing the type definition
  return `Executing action ${action}`;
};
```
