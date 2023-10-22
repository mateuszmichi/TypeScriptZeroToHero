# TypeScript Keywords

## As

**As** is a keyword you can use to cast one variable to another. This is sometimes useful when, from the code, we know that this specific type of variable has a more strict type than can be detected. The **as** keyword is used to cast variables; there is also `<>` syntax, but it is rarely used as it **interferes with JSX** syntax.

```ts
type AnimalType = "dog" | "cat";
const values = { dog: 2, cat: 10 };
const keys = Object.keys(values); // string[] - this is how Object.keys works for mutable objects
// Using 'as' to provide narrowed typing
const properKeys = Object.keys(values) as AnimalType[];
```

Let's say that we know better the result of the operation

```ts
type UserType = { id: number; email: string };
const cachedValue = JSON.parse(localStorage.getItem("user")) as UserType;
// Can access safely properties of the user object
console.log(cachedValue.id, cachedValue.email);
```

The casting syntax looks like this. This will work when JSX syntax is disabled

```ts
const cachedValue = <UserType>JSON.parse(localStorage.getItem("user"));
```

Using **as** exposes us to the risk of invalid code handling. That's why it should be used only as an exception and a last resort. TypeScript has a safety feature that prevents casting a variable of a specific type to a type that does not match at all.

```ts
const createString = (): string | null => "Example";

let value: string | null = createString();
// This casting makes sense if we know that value is a string in this place in the code
const castedValue = value as string;

// This will never make sense; that's why we need two casts to fool TypeScript
let value2: string | null = createString();
const castedValue2 = value2 as number; // Error
const castedValue3 = value2 as unknown as number; // Fine - but the app crashes
```

## Any

These two keywords will help you fix problems with typing when TypeScript itself will not be able to deduce the proper type of the variable. **In most cases**, falling back to using any or as will indicate that something is not properly typed. In some edge cases, you can use these keywords to work around errors. Their usage is common in generic functions.

**Any** keyword marks a variable that can contain any type of data. TypeScript will not complain when you try to use a property that, for example, is not accessible in some types. Using any neglects all the benefits provided by TypeScript and should be avoided if possible.

```ts
let bucket: any = "I can put anything here";
bucket = ["Any", "Thing"];

// TypeScript will not complain, but this line will cause the app to crash
console.log(bucket.toUpperCase());
```

## Unknown

**Unknown** is a safe version of any. This type indicates a variable whose shape we cannot be sure of. This variable is excellent for marking the value of the response from external sources. TypeScript, in contrast to any, will not allow you to use properties or methods of an unchecked variable. It will force you to write code that safely handles any type of input.

```ts
const response: unknown = getSomeExternalData();
response.toUpperCase(); // Error
if (typeof response === "string") {
  response.toUpperCase(); // Fine, code safely handled
}
```

There are libraries that make validating unknown input much easier. Below, there is an example using the [zod](https://github.com/colinhacks/zod) library.

```ts
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});
type UserType = z.infer<typeof UserSchema>;

const storageValue: unknown = JSON.parse(localStorage.getItem("cache"));
const validation = UserSchema.safeParse(storageValue);
if (validation.success) {
  console.log(validation.data.name, validation.data.age);
}
```

## Never

The keyword **never** marks a variable whose value will not occur, no matter what happens. This feature does not make sense from a code perspective, but it can be used to detect incompatibilities inside the code. TypeScript will detect problems with the logic by finding out that the output will never occur.

```ts
type ActionsType = "get" | "post";
const handleAction = (action: ActionsType) => {
  if (action === "get") {
    return console.log("Getting", action.toUpperCase());
  }
  if (action === "post") {
    return console.log("Posting", action.toUpperCase());
  }
  console.log("Hmmm", action.toUpperCase()); // Error
};
```

You can utilize it to force proper handling of all cases of a limited list of values.

```ts
type ActionsType = "get" | "post" | "delete";
const handleAction = (action: ActionsType) => {
  if (action === "get") {
    return console.log("Getting", action.toUpperCase());
  }
  if (action === "post") {
    return console.log("Posting", action.toUpperCase());
  }
  // TypeScript will warn us about missing action handling
  // Type 'string' is not assignable to type 'never'
  const _action: never = action;
  throw new Error(`Unhandled action, ${_action}`);
};
```

## Typeof

The keyword **typeof** enables us to extract the type of the variable. This is useful when we don't want to create boilerplate or want to extract the type of an object or function from an external library.

```ts
const value = { id: 10, name: "Alan" };
type ValueType = typeof value; // { id: number, name: string }
```

**Caution** - this mechanism is on the static layer, so do not expect that TypeScript will adjust to the real object during execution time. It will only deduce the type from the static analysis of the variable.

```ts
function getValue(threshold: number) {
  if (threshold > 1) return { success: true, value: 10 * threshold };
  return { success: false };
}

const value = getValue(2); // We know it is { success: true, value: 20 }
type ValueType = typeof value; // { success: true, value: number } | { success: false }
```

Use it to provide proper checks when using external imports.

```ts
// Let's assume that parseItems = ({ items, flatten }) => (...)
import { parseItems } from "externalLibrary";

type ItemType = { id: number; data: { value: number } };
function handleItems(items: ItemType[], parser: typeof parseItems) {
  // This will force us to provide proper arguments to the parser function
  parser({ items, flatten: true });
}
parseItems(items, parseItems);
```

## Keyof

This operator enables us to extract keys of the **object type** in the form of a union of strings. This can be useful to reduce boilerplate for actions such as object mapping, index signatures, or adding arguments inside functions that require the key of a certain object type.

```ts
const featuresConfig = {
  sepa: true,
  summerSale: false,
  winterSale: true,
};
type FeaturesConfigType = typeof featuresConfig;
type FeatureType = keyof FeaturesConfigType; // 'sepa' | 'summerSale' | 'winterSale'

function isFeatureEnabled(config: FeaturesConfigType, key: FeatureType) {
  // can safely use index access as it is a key of FeaturesConfigType
  return config[key] ? "enabled" : "disabled";
}

isFeatureEnabled(featuresConfig, "sprintSale"); // Error detected
```

Imagine that you will remove one feature from the config - when using **typeof** and **keyof** TypeScript will quickly check if there are any use cases that you forgot to adjust to changes inside the code. This reduces also boilerplate.

We will use `keyof` in great numbers when writing **generic templates** and functions for generic object types.

## As const

This keyword can mark some value as immutable. This is really helpful for TypeScript when dealing with objects that can be changed inside the code. There are three common places where you can use it to make the type system better inside your codebase.

Marking objects as const

```ts
const BaseType = {
  COMMON: "common",
  RARE: "rare",
  ULTRA_RARE: "ultra-rare",
};
const baseValues = Object.values(BaseType); // string[]

const AchivementType = {
  COMMON: "common",
  RARE: "rare",
  ULTRA_RARE: "ultra-rare",
} as const;
const values = Object.values(AchivementType); // ('common' | 'rare' | 'ultra-rare')[]
```

Marking object keys as const

```ts
const handleLanguage = (lang: "en" | "de") => {
  console.log(lang === "de" ? "Hallo!" : "Hello");
};

const base = {
  language: "de",
  initialValue: "Bitte",
};
handleLanguage(base.language); // Error as base.language is treated as a string

const baseFixed = {
  language: "de" as const,
  initialValue: "Bitte",
};
handleLanguage(baseFixed.language); // Fine
```

Marking an array as const - but you should rather use a tuple, as **as const** will mark array items as immutable, which is much stricter typing and probably will not match required types where values are being used.

```ts
const generateClient = () => {
  return [new Date().getTime(), { name: "newUser" }] as const;
};

const [id, data] = generateClient();
id; // number - fine
data; // { readonly name: "newUser"; } - this type is really strict
```

## Satisfies

The purpose of **satisfies** is to enforce a constraint on a variable without changing its type. This is super useful when used to define mock objects, parts of which can be accessed separately without losing their exact structure.

```ts
// Mock file
export type SuccessRespType = {
  success: true;
  data: { modifiedItems: number };
};
export type ErrorRespType = { success: false; error?: string };
export type RespType = SuccessRespType | ErrorRespType;

// We are using RespType to make sure our mock will always be of the correct type
export const mock1: RespType = { success: true, data: { modifiedItems: 10 } };
export const mock2 = {
  success: true,
  data: { modifiedItems: 10 },
} satisfies RespType;

// Test file
import { mock1, mock2, RespType, SuccessRespType } from "./mocks.ts";

const testMock = (resp: RespType) => {
  // Some test
};

const testMockData = (resp: SuccessRespType["data"]) => {
  // Some test
};

testMock(mock1); // Fine
testMockData(mock1.data); // Error
testMock(mock2); // Fine
testMockData(mock2.data); // Fine - satisfies keeps object's unique structure
```
