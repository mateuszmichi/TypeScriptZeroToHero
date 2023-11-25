# Type Predicate

## Usage

The type predicate is a specific type guard function that, when it returns true, marks a variable inside this branch of code as a specific type of value. Let's demonstrate this with an example:

```ts
type Dog = { name: string; bark: () => string };
type Parrot = { name: string; canSpeak: boolean; tweet: () => string };
type Pet = Dog | Parrot;

const isDog = (pet: Pet): pet is Dog => {
  return "bark" in pet && typeof pet.bark === "function";
};

const buyPet = (): Pet =>
  Math.random() > 0.5
    ? { name: "Max", bark: () => "Woof!!!" }
    : { name: "Polly", canSpeak: false, tweet: () => "Tweet!" };

const myPet = buyPet();
if (isDog(myPet)) {
  console.log(myPet.bark()); // We know it's a dog
} else {
  console.log(myPet.canSpeak, myPet.tweet()); // We know it's a parrot after elimination
}
```

Creating such a function can be beneficial if we are checking multiple times in different parts of the code for a specific type from the union for different variables. This kind of function is really useful not only inside if statements but also inside some utility functions:

```ts
const lotsOfPets = new Array().fill(10).map(() => buyPet()); // Pet[]

const standardFilter = lotsOfPets.filter(
  (pet) => "bark" in pet && typeof pet.bark === "function",
); // Pet[] - we know that it should be only dogs!

const predicateFilter = lotsOfPets.filter(
  // Same implementation but adding predicate return type
  (pet): pet is Dog => "bark" in pet && typeof pet.bark === "function",
); // Dog[] - nice!

const predicateFilter2 = lotsOfPets.filter(isDog); // Dog[] - even cleaner
```

The filter function is an example of a utility that can accept a type predicate, and in the return, it will adjust its outcome type.

## A small trap

We must be really careful when we are defining a type predicate. TypeScript trusts us that we are detecting properly if the variable is of a specific type. We can **make a mistake** here, and TypeScript will **not** warn us even if the code does not really make sense:

```ts
const isDog = (pet: Pet): pet is Dog => {
  return "tweet" in pet && typeof pet.tweet === "function";
};

if (isDog(myPet)) {
  console.log(myPet.bark()); // This code would throw an exception
}
```

Also, we must remember that this problem can arise when we change the structure of the `Pet` type, and we will not get a TypeScript error that would warn us about missing some dependency.

However, this problem will appear for more complex structures. For example, for plain filtering about null values, this will not be a problem:

```ts
// A common example of usage of a predicate
type ItemType = { name: string };
const nullableItems: Array<ItemType | null> = [
  /* ... */
];
const strings = nullableItems.filter((item): item is ItemType => item !== null); // ItemType[]
```

## Predicate function type

Of course, the predicate function has its own type notation. This is important as such functions are often an argument of some utility type.

```ts
type X = string | { name: string };

// Defining the predicate type
type PredicateType = (arg: X) => arg is { name: string };

function customFilter(value: X, filter: PredicateType): string {
  if (filter(value)) {
    return value.name; // We can safely use the type after the predicate
  }
  return value;
}
```

For the example above, it does not really make sense to ask for a predicate filter for a known type. This is only for example purposes. Often, the predicate type is used as the type of a function's argument in generics. This topic will return soon.
