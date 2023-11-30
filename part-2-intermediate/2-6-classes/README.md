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
