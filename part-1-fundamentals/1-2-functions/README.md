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
const rootSquare2 = (value: number) => {
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
const whatIsMyName2 = (surname?: string) => {
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
const justThrowError2 = () => {
  throw new Error("Catch it!");
};
```

The same applies to classic functions.

```ts
type NestedArraysType = NestedArraysType[] | string;
function flattenArray(input: NestedArraysType): string {
  if (typeof input === "string") return input;
  // Without the definition of the return type, TypeScript will not be able to detect
  // the return type of a self-referencing expression
  return input.map((element) => flattenArray(element)).join();
}

// By default, TypeScript will resolve the return type as a generic string
function getAction(): "get" | "post" {
  return Math.random() > 0.5 ? "get" : "post";
}
```

## Spread Arguments

In JavaScript, you can define a function that will accept any number of arguments of a certain type. You can leverage it to create well-defined function types.

```ts
type FunctionWithSpreadArgsType = (...args: string[]) => string;
const joinStrings: FunctionWithSpreadArgsType = (...args) => {
  return args.join(" ");
};

// Inline definition
const joinStrings2 = (...args: string[]) => {
  return args.join(" ");
};

// We can force at least one argument
type AtLeastOneArgType = (x: number, ...args: number[]) => number;
const safeMinimumNumber: AtLeastOneArgType = (x, ...args) => {
  return Math.min(x, ...args);
};

// Mixed argument types example
type MixedArgumentsType = (
  user: string,
  ...entitiesIds: (string | number)[]
) => void;
const registerUserWithItems: MixedArgumentsType = (user, ...entitiesIds) => {
  console.log("Registering user");
  entitiesIds.forEach((id) => console.log(`${id} of type ${typeof id}`));
};
```

## Async Functions

Inside TypeScript, there is no special syntax for defining asynchronous functions. To mark an async function, all we need to do is use the `Promise<>` template on the return value.

```ts
// There is no reference to the 'async' keyword inside the type definition
type AsyncFunctionType = () => Promise<void>;
// The function uses 'async' as usual
const asyncExample = async () => {
  await Promise.resolve(null);
  console.log("Finished");
};

// Inline definition - no need to define Promise<void>
const asyncExample2 = async () => {
  await Promise.resolve(null);
  console.log("Finished");
};

type AsyncFunctionReturningType = () => Promise<number>;
const asyncReturning = async () => {
  const value = await Promise.resolve(Math.random());
  return value;
};

// Inline definition - without wrapping the string in a promise will cause an error
const asyncReturning2 = async (): Promise<string> => {
  const value = await Promise.resolve(Math.random());
  return value;
};
```

## Function as an Argument

In most cases, you do not need to define the type of the function that you are creating. TypeScript will deduce, most probably infer, the type of the returned value, and all you need to provide is the definition of the argument types.

Sometimes in the code, a function will be passed as a callback to another function. This is a situation where a proper function definition is crucial.

```ts
type WithSimpleCallbackType = (cb: () => string) => string;
const withSimpleCallback: WithSimpleCallbackType = (cb) => {
  return `My name is ${cb()}`;
};

// Inline definition
const withSimpleCallback2 = (cb: () => string) => {
  return `My name is ${cb()}`;
};

// Callback accepting arguments
const canCreateUser = async (
  name: string,
  checkUser: (user: string) => Promise<number | null>,
): Promise<boolean> => {
  const user = await checkUser(name);
  return user === null;
};

// Define optional arguments inside the callback only when they are executed optionally
const optionalArgsInCallback = (
  id: number,
  canAccess: (service: string, companyId?: number) => boolean,
) => {
  const user = getUserById(id);
  if (user.isBusinessUser) {
    const companyId = getCompanyByUserId(id);
    return canAccess("SomeService", id);
  }
  return canAccess("SomeService");
};
```

When creating callback arguments, sometimes the function passed can have a more complex type than required. TypeScript will check if the call can be executed safely. For example, when the callback accepts one argument, we can pass a function that has no arguments, as passing one will result in the proper return type, and it is safe. Also, when we are expecting a function without a return value (void), we can still pass a function that returns some value, as the function using the callback will not rely on the output of the callback execution.

```ts
const callbacksV1 = (cb: (x: number | string, y?: number[]) => void) => unknown;

// No problem when a passed function can handle a wider range of specific arguments
type AcceptedType1 = (x: number | string | null, y?: number[]) => void;
const acceptedType: AcceptedType1 = (x, y) => {};
callbacksV1(acceptedType); // OK

// No problem when returning when void is expected return type
type AcceptedType2 = (x: number | string, y?: number[]) => string;
const acceptedType2: AcceptedType2 = (x, y) => "Something";
callbacksV1(acceptedType2); // OK

// No problem when adding optional arguments
type AcceptedType3 = (x: number | string, y?: number[], z?: string) => void;
const acceptedType3: AcceptedType3 = (x, y, z) => {};
callbacksV1(acceptedType3); // OK

// No problem when passing a function with fewer required arguments
type AcceptedType4 = (x: number | string) => void;
type AcceptedType5 = () => void;
const acceptedType4: AcceptedType4 = (x) => {};
const acceptedType5: AcceptedType5 = () => {};
callbacksV1(acceptedType4); // OK
callbacksV1(acceptedType5); // OK
```

But problems will be visible when a passed function does not match the required function type.

```ts
const callbacksV2 = (
  cb: (x: number | string, y: number[]) => string | number,
) => unknown;

// Function handles only some range of argument types
type FailingType1 = (x: number, y: number[]) => string | number;
const failingType: FailingType1 = (x, y) => "Test";
callbacksV2(failingType); // Error

// Function wants to return a wider range of returned types
type FailingType2 = (x: number | string, y: number[]) => string | number | null;
const failingType2: FailingType2 = (x, y) => null;
callbacksV2(failingType2); // Error

// Function requires more arguments
type FailingType3 = (
  x: number | string,
  y: number[],
  z: string,
) => string | number;
const failingType3: FailingType3 = (x, y, z) => "Test";
callbacksV2(failingType3); // Error
```
