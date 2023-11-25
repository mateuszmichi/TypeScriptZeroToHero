# Built-in Utilities

In various parts of our code, we may require a type similar to an existing one but with slight modifications. We could opt for copying and pasting the existing type and make necessary alterations where required. However, this approach becomes cumbersome when we intend to update our type system with new changes, as we would need to modify each dependent place. Utilizing built-in utilities can significantly reduce boilerplate code and establish relationships between dependent types. This, in turn, enhances the safety of our codebase and streamlines the refactoring process.

## Object Values Transformation

TypeScript provides several built-in utilities that simplify the modification of object value types. We can utilize _Partial_, _Required_, and _Readonly_ templates to tailor our object types.

**Partial** makes all values optional. This utility type is commonly used, for example, to define the type of a configuration object that contains default values that users can override if needed.

```ts
type SaveFileConfig = {
  fileName: string;
  mode: "w" | "w+";
  encoding: string;
};

const handleFileDownload = (
  content: string,
  config: Partial<SaveFileConfig> = {},
) => {
  console.log(config.encoding); // encoding?: string | undefined
  console.log(config.fileName); // fileName?: string | undefined
  console.log(config.mode); // mode?: "w" | "w+" | undefined
};
```

**Required** is the opposite of partial; it creates a new type that removes the option to skip a key or assign an undefined value. This utility is useful when we want to enforce passing all required data:

```ts
type FormState = {
  name?: string;
  surname?: string;
  age?: number;
};

const submitForm = (data: Required<FormState>): Required<FormState> => ({
  name: data.name.toUpperCase(),
  surname: data.surname.toUpperCase(),
  age: Math.floor(data.age),
});
```

**Readonly** utility marks every key and its value as read-only:

```ts
type AppConfig = {
  apiUrl: string;
  features: string[];
};

const getConfig = (): Readonly<AppConfig> => {
  return (window as any).injectedConfig;
};

const config = getConfig();
config.apiUrl = "test"; // Cannot assign to 'apiUrl' because it is a read-only property.
```

## Parts of the Object

In various situations, we often require only specific parts of objects. Depending on the scenario, we can use two methods to extract only the necessary fragments.

**Pick** utility enables the extraction of a list of keys along with their corresponding value types. The first argument is the object type, and the second is a union of the keys to be picked:

```ts
type Author = {
  id: number;
  name: string | string[];
  surname: string;
  books: { title: string }[];
  birthday: Date;
};

type OnlyAuthorName = Pick<Author, "name" | "surname">;

function getFullName({ name, surname }: OnlyAuthorName) {
  return `${typeof name === "string" ? name : name.join(" ")} ${surname}`;
}
```

Conversely, **Omit** works by specifying the keys to be excluded from the resulting object type:

```ts
type Author = {
  id: number;
  name: string | string[];
  surname: string;
  books: { title: string }[];
  birthday: Date;
};

type AuthorWithoutBooks = Omit<Author, "books">;

function getAuthorInfo({ name, surname, birthday, id }: AuthorWithoutBooks) {
  return `${typeof name === "string" ? name : name.join(" ")} ${surname} (${id})
Born: ${birthday.toDateString()}`;
}
```

Both utilities can return the same result type, as illustrated below:

```ts
type Author = {
  id: number;
  name: string | string[];
  surname: string;
  books: { title: string }[];
  birthday: Date;
};
type A = Pick<Author, "id" | "name" | "surname">;
type B = Omit<Author, "books" | "birthday">; // A === B
```

Choosing the appropriate utility will depend on the context where the reduced object type is being used. Utilize **Pick** when specific keys are expected, such as in a helper function requiring only particular keys. On the other hand, when employing object destructuring and using `...rest` of the object, **Omit** is recommended. Furthermore, Omit can be useful in situations where a part of the object needs to be removed before proceeding with the subsequent code.

Why should we care about using the proper utility if the resulting fragment type is the same? Making these considerations allows us to foresee potential changes and limits modifications for the **Pick** and **Omit** second arguments accordingly. This proactive approach ensures type checking accuracy, ultimately reducing the time required during refactoring or the addition of new features.

## Function Transformation

TypeScript offers built-in utilities that can extract parameters and return types from the provided function type.

```ts
const exampleFunction = (x: number, y: string) => {
  return Promise.resolve({ xx: x, yy: y });
};

type Params = Parameters<typeof exampleFunction>; // [x: number, y: string]
type Result = ReturnType<typeof exampleFunction>; // Promise<{ xx: number; yy: string; }>
```

These utilities are not used as often as object utilities, but sometimes we want compatible return types between functions, and we can use these types to enforce such behavior. The following code example will be familiar to Redux users:

```ts
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    /* ...reducers */
  },
});

export type RootState = ReturnType<typeof store.getState>;

// Usage where values should be 1:1 to the return type of the store state
export const thunkExample =
  (): ThunkAction<Promise<void>, RootState, undefined, AnyAction> =>
  async (dispatch) => {
    // thunk implementation
  };

// Or an example using a hook that forces the marking of the state as compatible with the returned type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Personally, I sometimes combine **Parameters** and **ReturnType** when writing unit tests for functions. This is useful when I want to test multiple arguments and results simultaneously:

```ts
import { testedUtility } from "./index";

const tests: Array<
  [Parameters<typeof testedUtility>, ReturnType<typeof testedUtility>]
> = [
  /* I will be forced to pass matching data to function calls */
];

// This call is now type-safe
tests.forEach(([args, expectedResult]) =>
  expect(testedUtility(...args)).toBe(expectedResult),
);
```

## Union Transformations

There are also utilities that make working with unions easier.

**Exclude** allows removing specific values from the union type:

```ts
type VerificationStatusType =
  | "verified"
  | "expired"
  | "invalid"
  | "already-verified";

const requestPasswordReset = (
  status: Exclude<VerificationStatusType, "already-verified">,
) => {
  // This code can handle all statuses except "already-verified"
  // status: "verified" | "expired" | "invalid"
};
```

**Extract** limits union values to a list of specified possible values:

```ts
type A = "a" | "b" | "c" | "d";
type B = "c" | "d" | "e" | "f";

type R = Extract<A, B>; // "c" | "d"
```

While intersection might be considered, the usage of Extract forces logic for unions as arguments. The difference becomes noticeable when dealing with object types:

```ts
type A = { b: boolean; s: string };
type B = { b: boolean; n: number };

type IntersectionC = A & B; // { b: boolean; s: string; n: number; }
type ExtractionC = Extract<A, B>; // never -> as this utility treats values as unions
```

Additionally, there is **NonNullable**, which excludes `null` and `undefined` from a passed union:

```ts
type UserInput = string | number | null | undefined;

type CleanInput1 = Exclude<UserInput, null | undefined>; // string | number
type CleanInput2 = NonNullable<UserInput>; // string | number
```
