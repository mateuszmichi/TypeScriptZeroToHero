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

/**
 * Implement a class that represents a DOM element selector
 * 1. It should be initialized either by providing an id (string)
 * 2. Or by providing a configuration with a data- key and its value (see usage)
 * 3. The class should have a method returning a specific DOMElement (see usage)
 * 3a. We can use document.querySelector<> for this example
 * 3b. We can initialize the query inside the constructor and reuse it
 */
function Exercise3() {
  class DOMSelector {}

  // Following code should have no errors
  const selector1 = new DOMSelector("myId");
  const elem1 = selector1.getElement(); // Should have Element | null

  const selector2 = new DOMSelector<HTMLInputElement>({
    dataKey: "data-testid",
    value: "myTestId",
  });
  const elem2 = selector2.getElement(); // Should have HTMLInputElement | null
  if (elem2) elem2.value.toUpperCase();
}

type EmployeeType = "Manager" | "Developer";

/**
 * Implement missing parts of code.
 * Manager and Developer should inherit from Employee.
 */
function Exercise4() {
  class Employee {
    name: string;
    role: EmployeeType;

    constructor(name: string, role: EmployeeType) {
      this.name = name;
      this.role = role;
    }

    getDetails() {
      return `Name: ${this.name}, Role: ${this.role}`;
    }
  }

  class Manager {
    teams: number;

    constructor(name: string, teams: number) {
      // Implement me
    }

    getDetails() {
      // Implement me
      // return `${}, Taking care of: ${} teams`;
    }

    manageTeam() {
      return `Managing the team`;
    }
  }

  class Developer {
    techStack: string[];

    constructor(name: string, techStack: string[]) {
      // Implement me
    }

    getDetails() {
      // Implement me
      // return `${}, Tech Stack: ${}`;
    }

    writeCode() {
      return `Writing code`;
    }
  }

  // Creating instances
  const manager = new Manager("Alice", 5);
  const developer = new Developer("Bob", ["JavaScript", "Python"]);

  console.log(manager.getDetails()); // Output: Name: Alice, Role: Manager, Taking care of: 5 teams
  console.log(manager.manageTeam()); // Output: Managing the team

  console.log(developer.getDetails()); // Output: Name: Bob, Role: Developer, Tech Stack: JavaScript, Python
  console.log(developer.writeCode()); // Output: Writing code
}
