# Functions

## Function Types

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

The same rules apply for both lambda functions and classic function declarations.

```ts
// ': string' is added as an example of how to define return types
// It can be skipped as TypeScript will know the result for these particular functions
function mixedArguments(bookId: number, chapterIds: number[]): string {
  return `Reading book ${bookId}, chapters ${chapterIds.join(", ")}`;
}

function executeSpecificAction(action: "get" | "post" = "post"): string {
  return `Executing action ${action}`;
}
```

## Return Type

When creating a type representing a function, you need to define arguments and their types, as well as the return type of the function. Marking the return type of the function with inline declaration is not required if it can be properly detected from static code analysis. One exception is the recursive function. For functions, there are special `void` and `never` return types.

```ts
// A function not returning anything can be marked with 'void'
type FunctionWithoutReturnType = (value: string) => void;
const funWithoutReturn: FunctionWithoutReturnType = (value) => {
  console.log(value);
};

// Inline declaration - no need to mark (value: string): void
const funWithoutReturn2 = (value: string) => {
  console.log(value);
};

// A function that will always throw will never return
// 'never' marks unreachable code
type ThrowingFunctionType = () => never;
const justThrowError: ThrowingFunctionType = () => {
  throw new Error("Catch it!");
};

// Inline declaration - no need to mark (): never
const justThrowError2: ThrowingFunctionType = () => {
  throw new Error("Catch it!");
};
```

The same applies to classic functions.

```ts
type NestedArraysType = NestedArraysType[] | string;
const flattenArray = (input: NestedArraysType): string => {
  if (typeof input === "string") return input;
  // Without the definition of the return type, TypeScript will not be able to detect
  // the return type of a self-referencing expression
  return input.map((element) => flattenArray(element)).join();
};

// By default, TypeScript will resolve the return type as a generic string
function getAction(): "get" | "post" {
  return Math.random() > 0.5 ? "get" : "post";
}
```
