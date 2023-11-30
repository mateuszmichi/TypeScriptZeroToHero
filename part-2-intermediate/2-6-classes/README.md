# Classes

## Class Creation

The `class` keyword was introduced in ES2015, and TypeScript fully supports it. The basic syntax remains the same as in JavaScript:

```ts
class Rectangle {}
```

We can define properties inside TypeScript by declaring the property and its value type:

```ts
class Rectangle {
  height: number;
  width: number;
}
```

However, the code above will produce an error if we are using strict mode (`--strictPropertyInitialization`). It is highly recommended to use this mode. Therefore, when creating classes with required properties, we should add their initial values or initialize them inside the constructor:

```ts
// Proper handling
class Rectangle {
  height: number; // Or height = 0
  width: number; // Or width = 0

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}
```

An additional note: the field needs to be initialized in the constructor itself. TypeScript does not analyze methods invoked from the constructor.

Readonly properties can be defined with the `readonly` prefix. This will prevent assignments to the field outside the constructor, but the check is only at the type system level:

```ts
class PrivPerson {
  readonly name: string = "Anon";

  constructor(name?: string) {
    if (name !== undefined) {
      this.name = name;
    }
  }
}
```

## Class Methods

We can add methods to our classes as in JavaScript. Inside them, we will have access to the properties, etc.:

```ts
class Rectangle {
  height = 0;
  width = 0;

  getArea() {
    return this.height * this.width;
  }
}

const rect = new Rectangle();
rect.getArea();
```

Similarly, we can add getters (and setters):

```ts
class Rectangle {
  height = 0;
  width = 0;

  get area() {
    return this.height * this.width;
  }
}

const rect = new Rectangle();
rect.area; // number
```

## Generic Classes

The concept of generics has already been introduced. The same mechanism that we saw for functions applies here:

```ts
class BackendFetching<D> {
  data?: D;
  loading = false;
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  // Just some sketch, don't use in production :D
  load() {
    this.loading = true;
    fetch(this.url)
      .then((resp) => {
        this.data = resp.json() as D;
        this.loading = false;
      })
      .catch((e) => {
        console.error(e);
        this.loading = false;
      });
  }

  getStatus() {
    if (this.data !== undefined) {
      return this.loading ? "loading" : "idle";
    }
    return this.loading ? "refetching" : "fetching";
  }

  getFreshData(): D | undefined {
    return this.loading ? undefined : this.data;
  }
}
```

We can refer to the generic type everywhere inside the class definition **except in static** methods and properties.

## Interface Implementation

A class can be made to implement an interface (or corresponding object type) by using the `implements` keyword within the class definition:

```ts
interface WithArea {
  getArea(): number;
}

class Rectangle implements WithArea {
  height = 0;
  width = 0;

  getArea() {
    return this.height * this.width;
  }
}
```

TypeScript checks whether your class instance matches the required object shape. However, it doesn't add additional context to the interface. Therefore, we must f.e. specify the types of arguments within the interface's function definition:

```ts
interface WithCircumferenceCheck {
  checkCircumference: (value: number) => boolean;
}

class Rectangle implements WithCircumferenceCheck {
  height = 0;
  width = 0;

  // This is an invalid implementation!
  // However, the final instance will match WithCircumferenceCheck
  // Therefore, TypeScript won't complain - by default it would treat checkCircumference as:
  // `checkCircumference: (value: any) => boolean`
  checkCircumference(value) {
    value.toLowerCase(); // Would cause an error if called with number
    return value >= 2 * (this.height + this.width);
  }
}
```

The correct implementation should copy the function definition and implement it like this:

```ts
checkCircumference(value: number) {
  return value >= 2 * (this.height + this.width);
}
```

It's also possible to implement multiple interfaces simultaneously:

```ts
class Rectangle implements WithCircumferenceCheck, WithArea {
  /* implementation */
}
```

## Constructors and Overloads

We saw in the basic example how and when we need to define a constructor. We can also use the **overloads** mechanism and declare multiple shapes of the constructor. Be aware that we only implement it once, so our code should consider different types of input data:

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);
  constructor(s: string);
  // xs: unknown, y?: unknown -> to match both functions above
  constructor(xs: unknown, y?: unknown) {
    if (typeof xs === "string") {
      const [_x, _y] = xs.replace(/^\(/, "").replace(/$\)/, "").split(",");
      this.x = Number(_x);
      this.y = Number(_y);
    } else {
      this.x = xs as number;
      this.y = y as number;
    }
  }
}

new Point(1, 1);
new Point("(2,3)");
```

Overloads can also be defined for standard methods:

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number): Point;
  move(s: string): Point;
  // (xs: unknown, y?: unknown): Point -> to match both functions above
  move(xs: unknown, y?: unknown): Point {
    if (typeof xs === "string") {
      const [_x, _y] = xs.replace(/^\(/, "").replace(/$\)/, "").split(",");
      this.x += Number(_x);
      this.y += Number(_y);
    } else {
      this.x += xs as number;
      this.y += y as number;
    }
    return this;
  }
}

const p = new Point(1, 1);
p.move("(1,1)").move(1, 2);
```

In contrast to the constructor, we can also define overloads on the interface that a class would implement:

```ts
interface WithMove {
  move(x: number, y: number): { x: number; y: number };
  move(s: string): { x: number; y: number };
}

class Point implements WithMove {
  /* implementation above will satisfy WithMove interface */
}
```

In the example above, we are also enforcing a return type for the function.

## Inheritance in TypeScript

The mechanism of inheritance remains the same as in standard JavaScript. Here, we focus on how this mechanism interacts with our type system. For a more in-depth understanding of how inheritance works, you can refer to (this JavaScript tutorial)[https://javascript.info/class-inheritance] on classes.

TypeScript uses the `extends` keyword in the same way as JavaScript to indicate that a class is extending another class. Let's examine this example:

```ts
class Animal {
  move() {
    console.log("Moving!");
  }
}

class Dog extends Animal {
  woof() {
    console.log("woof!");
  }
}

const d = new Dog();
d.move(); // Base class method
d.woof(); // Derived class method
```

We can override a method present in the base class:

```ts
class Animal {
  move() {
    console.log("Moving!");
  }
}

class Dog extends Animal {
  move(times?: number) {
    for (let i = 0; i <= (times || 1); i++) {
      console.log("Moving on my paws!");
    }
  }
}

const d = new Dog();
d.move(); // Triggers overridden method
d.move(3); // Triggers overridden method
```

We needed to define `move` method as accepting also `undefined` argument, as this is required to match contract from base class.

## Overriding properties

Sometimes, derived classes have properties with a more strict type than those in the base class:

```ts
class Base {
  x?: number | string;
}

class Derived extends Base {
  x?: number;
}
```

In the `Derived` class, we can specify that `x` is more strict, but we cannot make it more generic as TypeScript ensures that our derived class adheres to the base class contract.

There is a potential problem with the above implementation. It becomes visible when we use` useDefineForClassFields: true` in the TypeScript compilation configuration. Let's examine this code example:

```ts
class Base {
  x?: number | string;

  constructor(x?: number) {
    this.x = x;
  }
}

class Derived extends Base {
  x?: number;
}
```

This will result in the following ECMAScript-compliant code:

```js
const _defineArgs = {
  enumerable: true,
  configurable: true,
  writable: true,
  value: void 0,
};
class Base {
  constructor(x) {
    Object.defineProperty(this, "x", _defineArgs);
    this.x = x;
  }
}
class Derived extends Base {
  constructor() {
    super(...arguments);
    // This overrides "x"! It's value would get deleted
    Object.defineProperty(this, "x", _defineArgs);
  }
}
```

The code in `Derived` constructor will override `x` property from `Base`. If this is intentional, we should add an initializer. In our example, to avoid this issue, we should use declare syntax, designed to overcome the problem of restricting properties without reinitializing them:

```ts
class Base {
  x?: number | string;

  constructor(x?: number) {
    this.x = x;
  }
}

class Derived extends Base {
  declare x?: number;
}
```

Using `declare` in such cases will ensure it works correctly in every scenario.

## Super in TypeScript

We can access base class methods using the `super` keyword, which functions the same way it does in JavaScript. TypeScript ensures that we pass proper values to the base methods:

```ts
class Rectangle {
  _width: number;
  _height: number;

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  set width(value: number) {
    this._width = value;
  }
  set height(value: number) {
    this._height = value;
  }

  getInfo() {
    return `This is a rectange.`;
  }

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    // Using base constructor
    super(size, size);
  }

  getInfo() {
    // Using base methods
    return `${super.getInfo()} I am also a square.`;
  }

  // Using base setters and getters
  set width(value: number) {
    super.width = value;
    super.height = value;
  }
  set height(value: number) {
    super.width = value;
    super.height = value;
  }
  get width() {
    return super.width;
  }
  get height() {
    return super.height;
  }
}
```

A note to consider - when overriding setters / getters, we must define corresponding getters / setters as well; otherwise, they will get deleted. They are defined together under the hood. JavaScript is not the most intuitive OOP language, and while TypeScript makes it safer to work with, it doesn't eliminate all language-specific "features".
