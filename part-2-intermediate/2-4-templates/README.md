# Templates

## Basic Template

A significant aspect of software engineering involves constructing components that not only possess well-defined and consistent APIs but also offer reusability. In TypeScript, we can create generic types that function across a variety of types rather than a singular one. This permits users to consume these components and leverage their own types.

Let's begin with the simplest example - a generic object type that contains a _value_ key capable of holding any type of data. We intend to create a family of types, so we opt not to designate the key with _any_. Such a template can be utilized to generate similar types that are determined from the structure of the template but substitute every argument with the provided type:

```ts
type GenericType<T> = { value: T };

type GenericTypeWithString = GenericType<string>; // { value: string }
type GenericTypeWithNumber = GenericType<number>; // { value: number }
type GenericTypeWithUnion = GenericType<{ name: string } | null>; // { value: { name: string } | null }
```

The concept of defining a portion of the type by passing another type as an argument should not be surprising. We use the same mechanism for `Array<>` or utility types discussed earlier.

We aren't limited to just one argument passed to a template type. We can use these "argument types" for any part of the final type structure. It could be the value of an object's key or even the return type of a function. Think of the arguments as pre-existing types that can be used anywhere:

```ts
type TransformGeneric<T, S> = { transform: (v: T) => S };

const str2num: TransformGeneric<string, number> = {
  transform: (v) => Number(v), // must be (v: string) => number
};
```

We can create a reusable general type that will be specified in detail for each use case. Let's consider an API response that can be either successful, returning some data, or an error, offering an error message:

```ts
// Utilizing type guard "status" key
type ApiResponse<D> =
  | { status: "success"; data: D }
  | { status: "error"; message: string };
```

Now within our application, we can have various response types, but their structures will be standardized. This also means it'll be simpler to write generic handlers. This subject will be explored in detail in the next section (generic functions):

```ts
// TypeScript adapts type checking for specific template usage
const handleLogin = (
  response: ApiResponse<{ email: string; username: string }>,
) => {
  if (response.status === "success") {
    console.log(`${response.data.email} ${response.data.username}`);
  }
};

// Here, the data value has a different structure
const handleResetPassword = (response: ApiResponse<{ token: string }>) => {
  if (response.status === "success") {
    console.log(`Use: ${response.data.token} to reset the password`);
  }
};
```

## Optional Template Argument

We can make a portion of the generic type optional to define. Similar to function arguments, optional types cannot be followed by required ones. The difference here is that we **must** provide a default type. The syntax follows:

```ts
// Using " = string" to define default type
type GenericType<V, T = string> = { value: V; target: T };

type T1 = TransformGenericFun<number>; // { value: number, target: string }
type T3 = TransformGenericFun<number, boolean | undefined>; // { value: number, target: boolean | undefined }
```

Another example with multiple optional arguments:

```ts
// Utilizing templates, we can also create a general type that defines function types
type TransformGenericFun<T = any, S = any> = (v: T) => S;

type T1 = TransformGenericFun; // (v: any) => any
type T2 = TransformGenericFun<number>; // (v: number) => any
type T3 = TransformGenericFun<number, any>; // (v: number) => any
type T4 = TransformGenericFun<number, string>; // (v: number) => string
```

## Constraining Template Argument Type

Not every type will always be compatible to be passed into our newly created template. We can limit the argument using the **extends** expression inside the argument definition:

```ts
type ExtendString<T extends string> = { value: T };

type A = ExtendString<string>; // { value: string; }
type B = ExtendString<"subset" | "of" | "strings">; // { value: "subset" | "of" | "strings"; }
type C = ExtendString<number>; // Error: Type 'number' does not satisfy the constraint 'string'
```

Here's an example extending an empty object and setting a default value. We can safely use the **keyof** syntax here:

```ts
type ExtendsObject<T extends object = {}> = { [key in keyof T]: boolean };

type A = ExtendsObject; // {}
type B = ExtendsObject<{ x: string; y: number }>; // { x: boolean, y: boolean }
```

Alternatively, we can enforce a specific shape for the object type:

```ts
type MoreComplicated<T extends { name: string }> = {
  [key in Exclude<keyof T, "name">]: boolean;
} & { name: string[] };

type A = MoreComplicated<{ name: string; x: string }>; // { x: boolean, name: string[] }
type B = MoreComplicated<{ x: string }>; // Error: Type '{ x: string; }' does not satisfy the constraint...
```

## Adding Relations Between Arguments

Sometimes, a template with multiple arguments needs to maintain a relationship between them to produce a valid result type.

We can set the previous type as the default value for subsequent argument types:

```ts
type WithRelation<T, S = T> = { first: T; second: S };

type A = WithRelation<string>; // { first: string; second: string }
type B = WithRelation<string, number>; // { first: string; second: number }
type C = WithRelation<number>; // { first: number; second: number }

// We are not limited to easy S = T default value
type WithRelation2<T, S = { value: T }> = { first: T; second: S };
type D = WithRelation2<number>; // { first: number; second: { value: number } }
```

We can also use this type within the `extends` syntax:

```ts
type WithExtends<T extends object, K extends keyof T = keyof T> = {
  [P in K]: T[P];
};

type User = { name: string; surname: string; age: number };
type A = WithExtends<User>; // { name: string; surname: string; age: number; }
type B = WithExtends<User, "name">; // { name: string; }
type C = WithExtends<User, "name" | "age">; // { name: string; age: number; }
```

Something noteworthy in the previous example is `[P in K]: T[P]`. Using this specific `P` key allows access to the specific key, so that we receive its value type on the right side. Utilizing `[key in K]: T[K]` would assign all keys to the right side, resulting in obtaining all possible key value types:

```ts
type Correct<T extends object, K extends keyof T = keyof T> = {
  [P in K]: T[P];
};
type Wrong<T extends object, K extends keyof T = keyof T> = {
  [key in K]: T[K];
};

type User = { name: string; surname: string; age: number };
type A = Correct<User, "name" | "age">; // { name: string; age: number }
type B = Wrong<User, "name" | "age">; // {name: string | number; age: string | number }
```

Here's another example utilizing `extends`:

```ts
type WithItems<I, D extends { items: I[] }> = {
  items: I[];
  rest: Omit<D, "items">;
};

type A = WithItems<string, { items: string[]; price: number }>; // items: string[], rest: { price: number }
```

## Conditional Types

Sometimes, specific types require special handling. When creating a template, we can utilize a type equivalent of the ternary operator, denoted by the syntax `extends (...condition) ? (type on match) : (type elsewhere)`.

Let's focus on this feature looking at a few examples. First, consider a template that replaces strings with an array of strings or, otherwise, encapsulates the provided type into an object:

```ts
type ReplaceStrings<S> = S extends string ? S[] : { value: S };

type A = ReplaceStrings<string>; // string[] - matching
type B = ReplaceStrings<number>; // { value: number } - else statement
type C = ReplaceStrings<string[]>; // { value: string[] } - else statement
```

Next, let's consider a more complex example. We'll create a JSON serializer. This serializer creates an object containing **serialize** and **deserialize** methods. It serializes objects to strings and then deserializes them. While it works well for most data, it requires special handling for **Date** instances. Currently, we'll skip handling arrays as they require more advanced features:

```ts
type JsonDeserializer<T> = T extends any[]
  ? never // Arrays are not supported at the moment
  : T extends object // First, check for objects
  ? T extends Date // Check for Date instances which will be serialized to strings
    ? string
    : { [K in keyof T]: JsonDeserializer<T[K]> } // Serialize object keys
  : T extends string | number | boolean | null
  ? T // Keep strings, numbers, booleans, and null intact
  : never; // Mark other types as unsupported (skipping their usage)

type Serializer<T> = {
  serialize: (input: T) => JsonDeserializer<T>;
  deserialize: (cache: JsonDeserializer<T>) => T;
};
```

Now, let's see how this behaves when used with some object types:

```ts
type JsonA = JsonDeserializer<{ name: string; date: Date }>; // { name: string; date: string; }
type JsonB = JsonDeserializer<{
  user: { name: string; date: Date };
}>; // { user: { name: string; date: string; } }
type JsonC = JsonDeserializer<{ unsupported: string[] }>; // { unsupported: never; }
type JsonD = JsonDeserializer<{
  age: number | null;
  nested: { unsupported: string[]; undef: undefined };
}>; // { name: number | null; nested: { unsupported: never; undef: never } }
```

The last example demonstrates how to detect an empty object. We use `extends never` check, which identifies type mismatches and adjusts the final type to resolve issues:

```ts
type EmptyObjectDetect<T extends object> = keyof T extends never ? null : T;

type EmptyResult = EmptyObjectDetect<{}>; // null
type NotEmptyResult = EmptyObjectDetect<{ name: string }>; // { name: string }
```

The trick here is that `keyof {} === "never"`. While these specific checks might be challenging to remember or conceive, the internet and community resources can provide solutions. Once properly written, most of these templates are rarely modified. In the upcoming chapter on _advanced templates_, we'll explore more techniques used within these templates.

If you feel overwhelmed, don't worry. We'll become more familiar with the `extends` syntax in the section on _generic functions_. Defining generic type templates is more abstract than adjusting response types based on input manipulation logic.
