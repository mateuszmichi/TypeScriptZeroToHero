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
