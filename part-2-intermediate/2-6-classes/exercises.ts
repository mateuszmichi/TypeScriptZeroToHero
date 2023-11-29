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
