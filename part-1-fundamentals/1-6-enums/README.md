# Enums

## Creating Enum

There are three types of enums in TypeScript:

1. Numeric enums: The items are assigned numbers beginning with 0. To specify the starting count, we can provide a value.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

enum Hemispheres {
  Northern = 1,
  Southern,
}
```

2. String enums: Values are provided as strings.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

3. Mixed-type enums

```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

After creating an enum, we can use it as a type and access its values with `.key` inside the code. After transpilation, the code will be adjusted to JavaScript native objects.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
function handleMovement(dir: Direction) {
  if (dir === Direction.Up) console.log("Going up");
  if (dir === Direction.Down) console.log("Going down");
}

handleMovement(Direction.Up);
```

## Limitations of Enums

There are a few limitations to enums that can be annoying during development because they are not bound to existing JavaScript primitives. There are a few cases when the way enums work is not entirely intuitive.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
enum Hemispheres {
  Northern,
  Southern,
}
type GeoDirection = {
  dir: Direction;
  hemisphere: Hemispheres;
};

const geoObject: GeoDirection = {
  dir: Direction.Up,
  hemisphere: Hemispheres.Southern,
};

// Cannot assign a string value as an enum value, even when they match
// The comparison is working fine
if (geoObject.dir === "UP") {
  geoObject.dir = "DOWN";
}

// But for number enums, this works
if (geoObject.hemisphere === 1) {
  geoObject.hemisphere = 0;
}
```

This means that it's not the best idea to use enums as part of external data types, such as the response type from the backend. The string values are not valid enum values, so copying real responses into code or using them as mocks will require replacement and imports from enum objects.

## Alternative Approach

There is a popular approach that avoids enums. It relies on the as const object as the source of a list of values. It resolves the problem of compatibility with strings but comes with one drawback.

```ts
const DIRECTION = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;
type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];

// Usage
type GeoDirection = { dir: DirectionType };

const geoObject: GeoDirection = {
  dir: DIRECTION.Up,
};

if (geoObject.dir === "UP") {
  geoObject.dir = "DOWN"; // Fine!
  geoObject.dir = DIRECTION.Down; // Fine!
}
```

The drawback occurs when we need to create a type for one value of the enum.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
type DownAction = {
  // Limiting dir to only down
  dir: Direction.Down;
  value: number;
};
```

The equivalent will be a bit longer:

```ts
const DIRECTION = { Up: "UP", Down: "DOWN" } as const;
type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];
type DownAction = {
  // Need to use typeof
  dir: typeof DIRECTION.Down;
  value: number;
};
```

Also, TypeScript will not deduce the type as it would for an enum.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
const dirs = [Direction.Up, Direction.Down]; // Direction[]

const DIRECTION = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;
type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];
const dirs2 = [DIRECTION.Up, DIRECTION.Down]; // ("UP" | "DOWN")[]
dirs2.includes(DIRECTION.Left); // Error
const dirs2Fixed: DirectionType[] = [DIRECTION.Up, DIRECTION.Down];
dirs2Fixed.includes(DIRECTION.Left); // Fine
```
