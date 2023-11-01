# Types vs Interfaces

## Interchangeability

In the past, there used to be differences between the object definitions of interfaces and types. For several years, this has no longer been an issue. In most cases, switching between these two methods will not cause any problems. The syntax is almost identical, but we use the **interface** keyword instead of **type** and do not use **=**.

```ts
type AuthorType = {
  name: string;
  surname: string;
  age: number;
};

interface AuthorInterface {
  name: string;
  surname: string;
  age: number;
}
```

Variables will always match, regardless of whether we use type or interface. Check out the concept of [Duck typing](https://en.wikipedia.org/wiki/Duck_typing):

```ts
type BirdType = {
  wings: 2;
};
interface BirdInterface {
  wings: 2;
}

let birdByType: BirdType = { wings: 2 };
let birdByInterface: BirdInterface = { wings: 2 };
// No errors
birdByType = birdByInterface;
birdByInterface = birdByType;
```

## Extending Types and Interfaces

We can use intersections for both types and interfaces:

```ts
type BirdType = { wings: 2 };
type Owl = { nocturnal: true } & BirdType;
type Robin = { nocturnal: false } & BirdInterface;
```

To create an extended interface, we use the **extends** keyword:

```ts
type BirdType = { wings: 2 };
interface BirdInterface {
  wings: 2;
}

interface Chicken extends BirdInterface {
  colorful: false;
  flies: false;
}
// We can create an interface even by extending a type!
interface Peacock extends BirdType {
  colorful: true;
  flies: false;
}
```

There are limits when it comes to extending types to create interfaces:

```ts
type OptionA = { value: "A"; id: number };
type OptionB = { value: "B"; ids: number[] };
type Options = OptionA | OptionB;

// For types, it works
type ExtendedOptionsType = Options & { checked: boolean };
// Interfaces cause an error
interface ExtendedOptionsInterface extends Options {
  checked: boolean;
}
```

## Declaration Merging

At the most basic level, the merge mechanically joins the members of both declarations into a single interface with the same name:

```ts
interface Box {
  height: number;
  width: number;
}
// No problem - we are not overriding but extending the definition
interface Box {
  scale: number;
}
const box: Box = { height: 5, width: 6, scale: 10 };
```

This mechanism has more features, like namespaces or providing an overload list, but they are not important for this part of the tutorial.

## Pick One

As these two approaches have almost the same features, it's good to select one and stick to it inside your codebase. The TypeScript guide suggests using interfaces, but the person writing this Readme **prefers types**. More discussions can be found on this [StackOverflow thread](https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220).

**Caution - subjective section**

Personally, I choose types as I don't find interface merging helpful; I consider this feature even harmful, as I prefer to know exactly where new keys come from. I treat this feature as dangerous side-effect.

I choose interfaces when working with NodeJS backend services, which I build using classes. Unless dealing with classes and their **implements** keyword, I do not use interfaces. The second option where I would consider adding interfaces is building a reusable and publishable library. If there would be some part of the data passed into libraries' utilities that would be customizable by the user, this data I would mark with an interface as it would be by design extendable by the user.

An excellent example is using the **passport** library. library. The user can define their definition of how to populate the **user** value based on different authentication methods. When I was creating a custom middleware, I wanted to know that the user has specific keys like _id_ or _username_. The authors of the passport foresaw this need and defined the **Request** interface containing **user** field in the also as and interface (**User**). I could utilize the merging to have everywhere defined that the request object contains **user** with _id_ and _username_.

For the React users - I think that components props should not rely on the declaration merging. I use types to define both props and state. Just define proper types that cover all properties that we can safely pass into HTMLElements.
