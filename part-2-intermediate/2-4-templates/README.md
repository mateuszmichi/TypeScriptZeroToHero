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
