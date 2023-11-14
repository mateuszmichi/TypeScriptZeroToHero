# Objects

## Object Type

In JavaScript, almost everything is an object. Properly typing them will make working with them easier and more intuitive. When defining an object type, you are specifying specific keys and their accepted value types.

```ts
type AuthorType = {
  name: string;
  surname: string;
  age: number;
};
```

You can mark keys as optional

```ts
type Book = {
  title?: string;
  year?: number;
  author?: Author | Author[];
};

const book: Book = {}; // Fine, every key is optional
```

Be aware that marking using `?` is different from using as a value union containing `undefined`. In the second case you need to create a key with value but `undefined`

```ts
type OptionalType = {
  x: string;
  y?: string;
};
const optionalValue: OptionalType = {
  x: "Some value",
};

type UndefinedUnionType = {
  x: string;
  y: string | undefined;
};
const unionValue: UndefinedUnionType = {
  x: "Some value",
  y: undefined, // There would be error if we remove this key
};
```

There is no problem to define keys containing functions

```ts
type Shop = {
  id: number;
  isInStock: (book: Book) => boolean;
};
```

In JavaScript, keys can be strings, numbers, or Symbols

```ts
type MixedKeys = {
  // Number keys
  0: string;
  1: number;
  // String keys
  value: string | null;
  execute?: () => void;
  // Symbols - rarely used
  [Symbol.dispose]: () => void;
  [Symbol.asyncDispose]: () => Promise<void>;
};
```

## Generic Object Type

Sometimes the structure of an object is not strictly defined, and you only know the general shape of the object, but not which keys will be present. To define such an object type, you can use an index signature or the Record utility type.

```ts
type AgreementsType = {
  [service: string]: boolean;
};
type AgreementsType2 = Record<string, boolean>;

type BookTitleMapType = {
  [bookId: number]: string;
};
type BookTitleMapType2 = Record<number, string>;
```

You can also use union types to avoid boilerplate when defining object keys.

```ts
type HttpMethodType = "get" | "post" | "put" | "delete" | "options";
type HandlerType = {
  get?: (url: string) => Promise<unknown>;
  post?: (url: string) => Promise<unknown>;
  put?: (url: string) => Promise<unknown>;
  delete?: (url: string) => Promise<unknown>;
  options?: (url: string) => Promise<unknown>;
};
type IndexSignatureType = {
  [method in HttpMethodType]?: (url: string) => Promise<unknown>;
};
// When using Record, we need to use Partial to mark keys as optional
// This utility will be covered later
type IndexSignatureType2 = Partial<
  Record<HttpMethodType, () => Promise<unknown>>
>;
```

When using an index signature, you can combine it with standard key definitions.

```ts
type ActionType = "get" | "post";
type FeatureFlagType = "extendPurchase" | "sepa";

type ServiceType = {
  id: number;
  [action in ActionType]?: (url: string) => Promise<unknown>;
  [feature in FeatureFlagType]: boolean;
};
```

But when using an index type, the types must match.

```ts
type IndexMixedType = {
  [index: string]: string | number;
  // 'name' and 'value' are more specific
  name: string;
  value: number;
  // This one will throw an error
  liked: boolean;
};
```

## Readonly Keys

You can mark fields as read-only using the `readonly` keyword before the key name. Be aware of the fact that this is only checked during type checking. That means defining a property as read-only is not transpiled to JavaScript using `Object.defineProperty` with `writable: false`.

Readonly keys are **more strict** than standard one, so you cannot use type with readonly field where mutable field is expected

```ts
type WithReadonlyKeyType = {
  mutableField: number;
  readonly readonlyField: string;
};
```

## Type Lookup

You can extract the type of a specific key from an object's type using type lookup. This is especially useful when you need to reuse part of the type from a library that is not exposing its internal types.

```ts
type SomeExistingType = {
  error: string | { message: string } | { code: number };
};
// Access is via ['field'], JavaScript .field will not work here
type ErrorType = SomeExistingType["error"];
type HandleErrorType = (error: SomeExistingType["error"]) => string;
```

## Combining Object Types

When using union and intersection on object types, the final type is more complex to analyze than primitive types.
When intersecting types, you need to think of this as finding a common type that will be compatible with both types. So unique keys must stay the same while shared keys must be an intersection of them. It is easier to understand with examples.

```ts
type A = { name: string | number };
type B = { name?: string };
type C = A & B;
type CResult = { name: string };

type A2 = { name: string };
type B2 = { name: number };
type C2 = A2 & B2;
// We will never create an object that satisfies both A2 and B2 types
type CResult2 = { name: never };

type A3 = { name: string; surname: string };
type B3 = { name?: string; age: number };
type C3 = A3 & B3;
// Unique keys are required in the intersection result type
type CResult3 = {
  name: string;
  surname: string;
  age: number;
};
```

The union operation has different results. It is important to remember that the union basically says that the variable's type must match one of the types in the union. So if you look at the key's type level, the results may be different when looking at the whole object. As before, it is easier to understand with examples.

```ts
type A = { name: string; surname: string };
type B = { name: { language: string; value: string }; id: number };
type C = A | B;
// Using lookup
type NameType = C["name"]; // string | { language: string, value: string }
type IdType = C["id"]; // Error, as id does not exist in type A
// Destructuring structure
const { name } = SomeTypeCObject; // name is string | { language: string, value: string }
const { id } = SomeTypeCObject; // error

type A2 = { action: "post"; body: { message: string } };
type B2 = { action: "get"; body: string };
type C2 = A2 | B2;
// Using lookup
type ActionType = C2["action"]; // 'post' | 'get'
type BodyType = C2["body"]; // string | { message: string }
// Destructuring structure
const {
  action, // 'post' | 'get'
  body, // string | { message: string }
} = SomeActionTypeObject;
if (action === "post") {
  console.log(body, "Here TS knows I'm a { message: string }");
}

// Separately, each key is fine, but the whole object does not satisfy either type A2 or B2
const invalidAction: C2 = {
  action: "post",
  body: "someBody", // Error - Types of property 'body' are incompatible.
};
```

## Additional Keys Handling

The object type defines which keys are expected and what values they should contain. However, at the same time, it works more like interfaces in other languages, allowing objects to contain more elements than the type expects. This has some implications for the typing of object utility functions.

```ts
type AuthorType = { name: string; surname: string };

const displayAuthor = (author: AuthorType) => {
  console.log(`Author: ${author.name} ${author.surname}`);
};

const myFavoriteAuthor = {
  name: "Brandon",
  surname: "Sanderson",
  // Notice - additional key
  age: 47,
};

// Fine, the shape of the object matches
displayAuthor(myFavoriteAuthor);
```

On the other hand, TypeScript does not like additional keys when we manually define the object:

```ts
type AuthorType = { name: string; surname: string };

const myFavoriteAuthor: AuthorType = {
  name: "Brandon",
  surname: "Sanderson",
  age: 47, // Object literal may only specify known properties
};
```

But there will be no problem when using an object containing more keys, such as with the spread operator. This error is limited to manual object creation, where we are deliberately adding unexpected keys.

```ts
type AuthorType = { name: string; surname: string };

const myFavoriteAuthor = {
  name: "Brandon",
  surname: "Sanderson",
  age: 47,
};

const withSecondName: AuthorType = {
  ...myFavoriteAuthor,
  name: "Brandon Winn",
};
```
