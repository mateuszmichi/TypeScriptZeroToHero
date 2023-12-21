// Type predicate

/**
 * Fix the code to execute it safely
 */
function Exercise1(): string[] {
  const items: Array<string | null> = new Array(20)
    .fill(0)
    .map(() => (Math.random() > 0.5 ? "Some string" : null));

  return items.filter(() => true).map((x) => x.toUpperCase());
}

/**
 * Fix the predicate function
 */
function Exercise2() {
  type Dog = { name: string; bark: () => string };
  type Parrot = { name: string; canSpeak: boolean; tweet: () => string };
  type Pet = Dog | Parrot;

  const isDog = (pet: Pet) => {
    return true;
  };

  const buyPet = (): Pet =>
    Math.random() > 0.5
      ? { name: "Max", bark: () => "Woof!!!" }
      : { name: "Polly", canSpeak: true, tweet: () => "Tweet..." };

  const lotsOfPets = new Array(10).fill(0).map(() => buyPet());

  const myDogs: Dog[] = lotsOfPets.filter(isDog);
}
