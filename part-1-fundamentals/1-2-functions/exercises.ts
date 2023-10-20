// Function Types

// Replace all existing occurrences of this type with proper types
type XYZ = unknown;

function Exercise1() {
  type Exercise1Type = XYZ;
  const testFunction: Exercise1Type = (x, y) => {
    console.log(x, y);
  };

  // Define Exercise1Type to remove errors
  testFunction("Hello", "World");
  testFunction("Welcome");
  testFunction("Welcome", null);
}

function Exercise2() {
  // The function should return only 0 and 1 values
  function generateNumbers(numberOfItems: XYZ): XYZ {
    return new Array(numberOfItems)
      .fill(0)
      .map(() => (Math.random() > 0.5 ? 1 : 0));
  }

  const items = generateNumbers(10);
  // This check should return an error as the value cannot be 2
  if (items.some((i) => i === 2)) {
    console.log("Invalid implementation");
  }
}

function Exercise3() {
  type Exercise3Type = XYZ;
  const testFunction3: Exercise3Type = (
    names: XYZ,
    userName: XYZ = "Alan",
  ): XYZ => {
    return names.some((name) => name.includes(userName));
  };

  const v1: XYZ = testFunction3(["John Williams", "Ennio Morricone"]);
  const v2: XYZ = testFunction3(["Alan Rickman", "Daniel Radcliffe"]);
}

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

function Exercise5() {
  // This function will accept a list of items and count its length.
  // The catch is - it will count also items of children (and nested).
  function countItems(...items): XYZ {
    // Just for context, we don't need to define result and item types
    // in this case, as TS will know their types, but sometimes it is required.
    return items.reduce(
      (result: XYZ, item: XYZ) =>
        result + (Array.isArray(item) ? countItems(...item) : 1),
      0,
    );
  }

  const v1 = countItems(["A", 100, null, undefined, []]);
  const v2 = countItems([
    "B",
    90,
    [
      [
        [0, null],
        [9, 10],
      ],
    ],
  ]);
}

function Exercise6() {
  function executingCallback(callback: XYZ) {
    callback("string");
    callback("string", 90);
    callback(90);
  }

  function executingCallback2(callback: XYZ): XYZ {
    const user = await callback(10);
    const userWithCompany = await callback(10, true);

    if (user !== null && userWithCompany !== null) {
      return "OK";
    }
  }
}

function Exercise7() {
  const f1 = (x: number | string): XYZ => `${x} string`;
  const f2 = (): XYZ => "string";
  const f3 = (x: number, y?: number[]): XYZ =>
    y && y.length > 0 ? Math.min(...y) : `${x} string`;

  type CallbackType = XYZ;
  const testFunction = (cb: CallbackType) => {
    console.log(cb);
  };

  // Define TestFunctionType to remove errors;
  testFunction(f1);
  testFunction(f2);
  testFunction(f3);
}
