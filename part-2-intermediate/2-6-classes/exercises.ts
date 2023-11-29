// Classes

/**
 * Implement the Point class:
 * 1. It should have 'x' and 'y' properties.
 * 2. It should be initialized by a constructor.
 * 3. It should have a method that returns a Quadrant ("I" | "II" | "III" | "IV").
 * 4. It should have a getter method to calculate the distance from the (0, 0) point.
 */
function Exercise1() {
  class Point {}

  const point = new Point(10, 2);
  point.y = 5;
  point.getQuadrant();
  point.distance.toFixed();
}

/**
 * Add interfaces to the class and implement them
 */
function Exercise2() {
  interface WithFullName {
    fullName: string;
  }

  // We can implement an object type as well
  interface WithMatureCheck {
    isAdult: (regulation?: number) => boolean;
  }

  class Person {
    age: number;
    name: string;
    surname: string;

    constructor(name: string, surname: string, age = 0) {
      this.age = age;
      this.name = name;
      this.surname = surname;
    }
  }
}
