# Basic Types

## Primitives

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

## Union Types

Sometimes, variables will accept different types depending on the situation. To create a type that can accept a set of types, you will use the `|` union operator.

```ts
let stringOrNumber: string | number = 10;
// This will work properly
stringOrNumber = "10";

const stringOrNull: string | null = Math.random() > 0.5 ? "head" : null;
```

## Using Values as Types

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

## Arrays

There are two ways to define arrays in TypeScript, and they are interchangeable.

```ts
// Using [] syntax
const numberList: number[] = [1, 3];
const numberOrStringList: (number | string)[] = [1, "3"];
const booleanList: boolean[] = [true, false, true];

// Using Array<> template
const numberList: Array<number> = [1, 3];
const numberOrStringList: Array<number | string> = [1, "3"];
const booleanList: Array<boolean> = [true, false, true];
```

## Tuples

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
