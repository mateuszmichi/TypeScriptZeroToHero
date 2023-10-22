// Function Types

type XYZ = unknown;

/**
 * Define Exercise1Type with proper function type
 */
function Exercise1() {
  type Exercise1Type = XYZ;
  const testFunction: Exercise1Type = (x, y) => {
    console.log(x, y);
  };

  testFunction("Hello", "World");
  testFunction("Welcome");
  testFunction("Welcome", null);
}

/**
 * Replace XYZ type to provide proper function type
 * generateNumbers should return only 0 and 1 values
 */
function Exercise2() {
  function generateNumbers(numberOfItems: XYZ): XYZ {
    return new Array(numberOfItems)
      .fill(0)
      .map(() => (Math.random() > 0.5 ? 1 : 0));
  }

  const items = generateNumbers(10);
  // Expecting error that the value cannot be 2
  if (items.some((i) => i === 2)) {
    console.log("Invalid implementation");
  }
}

/**
 * 1. Define Exercise3Type with proper function type
 * 2. Remove Exercise3Type and define inline function type
 */
function Exercise3() {
  type Exercise3Type = XYZ;
  const testFunction3: Exercise3Type = (names, userName = "Alan") => {
    return names.some((name) => name.includes(userName));
  };

  const v1: XYZ = testFunction3(["John Williams", "Ennio Morricone"]);
  const v2: XYZ = testFunction3(["Alan Rickman", "Daniel Radcliffe"]);
}

/**
 * Define Exercise4Type with proper function type
 * getResponseGetBody and getResponsePostBody are dummy helper function
 */
function Exercise4() {
  const getResponseGetBody = (url: string) =>
    Promise.resolve(`Not implemented: ${url}`);
  const getResponsePostBody = (url: string) => Promise.resolve(200);

  type Exercise4Type = XYZ;
  const onlyPostActionResponse: Exercise4Type = async (
    url,
    action = "get",
  ): XYZ => {
    try {
      if (action === "get") {
        const response: XYZ = await getResponseGetBody(url);
        return response;
      }
      const response: XYZ = await getResponsePostBody(url);
      return response;
    } catch (e) {
      return null;
    }
  };

  const v1: XYZ = onlyPostActionResponse("/some/url", "post");
  const v2: XYZ = onlyPostActionResponse("/some/url");
  const v3: XYZ = onlyPostActionResponse("/some/url", "get");
}

/**
 * Provide proper typing for countItems function
 * This function will accept a list of items and count its length.
 * The catch is - it will count also items of children (and nested).
 *
 * Tip - you will need to create a support type for input type
 */
function Exercise5() {
  function countItems(...items): XYZ {
    // Just for context, we don't need to define 'result' and 'item' types in this case
    // TS will know their types. For more complexed reduce function we will need to help TS
    return items.reduce(
      (result: XYZ, item: XYZ) =>
        result + (Array.isArray(item) ? countItems(...item) : 1),
      0,
    );
  }

  const v1 = countItems(["A", "B", "C", "D", []]);
  const v2 = countItems([
    "B",
    "90",
    [
      [
        ["0", "null"],
        ["9", ["10"]],
      ],
    ],
  ]);
}

/**
 * Define XYZ callback types so the code will stop showing errors
 */
function Exercise6() {
  function executingCallback(callback: XYZ) {
    callback("string");
    callback("string", 90);
    callback(90);
  }
}

/**
 * Define XYZ callback types so the code will stop showing errors
 */
function Exercise7() {
  function executingCallback2(callback: XYZ): XYZ {
    const user = await callback(10);
    const userWithCompany = await callback(10, true);

    if (user !== null && userWithCompany !== null) {
      return "OK";
    }
  }
}

/**
 * Replace XYZ so the callbacks and their return values will be correct
 */
function Exercise8() {
  const f1 = (x: number | string): XYZ => `${x} string`;
  const f2 = (): XYZ => "string";
  const f3 = (x: number, y?: number[]): XYZ =>
    y && y.length > 0 ? Math.min(...y) : `${x} string`;

  const testFunction = (cb: XYZ) => {
    console.log(cb);
  };

  testFunction(f1);
  testFunction(f2);
  testFunction(f3);
}
