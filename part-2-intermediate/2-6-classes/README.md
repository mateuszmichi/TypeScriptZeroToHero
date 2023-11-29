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
