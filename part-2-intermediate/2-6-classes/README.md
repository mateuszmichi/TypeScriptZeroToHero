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
