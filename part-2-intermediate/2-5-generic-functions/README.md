# Generic Functions

## Syntax

We are familiar with creating templates that can describe a family of types. Now, we will focus on creating general functions that can accept a wide range of input data and return a corresponding type based on them. Most reusable libraries will export such functions.

The syntax for a standard `function` looks like this:

```ts
function genericFunction<T>(arg: T): T {
  console.log(arg);
  return arg;
}
```

The example above shows a basic identity function that logs input data. The syntax is identical to standard functions, but we add `<T>` as a template type argument. Rules for these arguments are the same as for type templates. We can assign default values, add multiple arguments, constrain arguments based on others, etc.

We could implement the generic function allowing any kind of input data, but we would lose information about the types:

```ts
function naiveGeneric(arg: any) {
  console.log(arg);
  return arg;
}
const x = naiveGeneric({ name: "Brandon" });
x.toUpperCase(); // TypeScript will not complain but code produces an error
```

That's why we should use generic functions in such code parts and keep type information, even if the function could accept any possible data type.

There is also a way to define generic functions for arrow (lambda) syntax:

```ts
const genericLambda = <T>(arg: T): T => {
  console.log(arg);
  return arg;
};
```

However, there is a problem with this syntax - in JSX files, the syntax will be marked as invalid. The same happens for using casting instead of `as`. Hence, we are going to use `function` syntax for generic functions from now on.

## Inferred Types

There is an interesting feature for generic functions. TypeScript will infer template types based on the input (arguments). That means we can occasionally skip the definition of types:

```ts
const x = genericFunction("Hello"); // inferred genericFunction<"Hello">
x.toLocaleLowerCase(); // TypeScript will properly detect it as a "Hello" string
```

We can always define the argument by ourselves:

```ts
const x = genericFunction<string>("Hello");
x; // string
```

## Specifying Return Type

The example with an identity function was a simple problem that could nicely demonstrate how a generic function works. We _could not define_ the return type, and TypeScript would deduce the result type based on the code. However, generic functions are _rarely so simple_. Sometimes, we need to use **any** and **as** if TypeScript is unable to deduce the general type of the variable inside complex and abstract code. Additionally, defining a return type is necessary to provide clear type hints for the final users.

Let's start with something easy. We will create a function that will accept any kind of input. If it is a number, it will be converted to a string:

```ts
function forceNum2Str<T>(input: T) {
  return typeof input === "number" ? input.toFixed() : input;
}
```

Now, let's use it and pass different arguments:

```ts
const a = forceNum2Str("text"); // string
const b = forceNum2Str<{ name: string }>({ name: "text" }); // string | { name: string }
const c = forceNum2Str<number>(100); // string | number
```

We notice that TypeScript is struggling even with such straightforward code. The inferred return type is by default `string | T`, so it does not consider how the code actually works. We will need to **manually define** the return type.

```ts
function fixedNum2Str<T>(input: T): T extends number ? string : T {
  // Adding 'as any' resolves an error:
  // Type 'string' is not assignable to type 'T extends number ? string : T'.
  // even though a string is expected to be returned for number inputs
  return typeof input === "number" ? (input.toFixed() as any) : input;
}
```

TypeScript was not able to deduce that we are following proper code and forced us to add an `as any` workaround. This will happen quite often inside generic functions. Now we have:

```ts
const a = fixedNum2Str("text"); // "text"
const b = fixedNum2Str<{ name: string }>({ name: "text" }); // { name: string }
const c = fixedNum2Str<number>(100); // string
```

Moving on to a function that can accept an object and if the keys' value type is a string, it will split the text by the space. Below, we have a basic implementation that iterates through keys and builds the resulting object:

```ts
function splitSentenceInsideObject<T extends object>(x: T) {
  const result = {};
  Object.keys(x).forEach((key) => {
    result[key] = typeof x[key] === "string" ? x[key].split(" ") : x[key];
  });
  return result;
}
```

The initial implementation is functional, but the returned type is an empty object, inferred from the initial type of the `result` variable. Let's fix the function to return the proper type:

```ts
type SplitSentenceType<T extends object> = {
  [P in keyof T]: T[P] extends string ? string[] : T[P];
};
function splitSentenceInsideObject<T extends object>(
  x: T,
): SplitSentenceType<T> {
  const result: SplitSentenceType<T> = {} as SplitSentenceType<T>;
  Object.keys(x).forEach((key) => {
    const v = x[key];
    result[key] = typeof v === "string" ? v.split(" ") : v;
  });
  return result;
}
```

And checking the usage:

```ts
// { name: string[]; age: number }
const a = splitSentenceInsideObject({ name: "string", age: 100 });
```

We created a helper template to reduce code duplication. We could also use `as any` for `result` variable. If we make a mistake inside the generic function, TypeScript will not detect the problem. Therefore, when dealing with generic functions, we must be extremely careful in their implementation. We rely on the deduced return type, so making a mistake in such a function could be detrimental to the type system not catching errors.

Personally, I would advise **always covering** such functions with unit tests. Ensure that TypeScript checks input and output types within the test files.
