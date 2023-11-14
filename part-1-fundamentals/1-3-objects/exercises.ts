// Object Types

import { fetchItems, FetchItemsResultType } from "./externalLibMock";

type XYZ = unknown;

/**
 * Define AuthorType to match the following types
 */
function Exercise1() {
  type AuthorType = XYZ;

  const author1: AuthorType = {
    name: ["Brandon", "Winn"],
    surname: "Sanderson",
    age: 47,
  };
  const author2: AuthorType = {
    name: "Terry",
    surname: "Pratchett",
    title: "Sir",
  };
}

/**
 * Define HandlerType to match the following types
 */
function Exercise2() {
  type HandlerType = XYZ;

  const actionHandler1: HandlerType = {
    handler: (response: string, context: any) => `${response} ${context}`,
  };
  const actionHandler2: HandlerType = {
    handler: (response: string) => console.log(response),
  };
}

/**
 * Define TranslationMapper to remove errors
 */
function Exercise3() {
  type LanguageType = "en" | "de" | "fr";
  type TranslationMapper = XYZ;

  function translateText(
    key: string,
    language: LanguageType,
    mapper: TranslationMapper,
  ) {
    return mapper[key][language];
  }
}

/**
 * Define AcceptedPetsConfigType
 */
function Exercise4() {
  type Pets = "dog" | "cat" | "rabbit" | "hamster";
  type AcceptedPetsConfigType = XYZ;

  const config1: AcceptedPetsConfigType = {
    dog: true,
    rabbit: false,
  };
  const config2: AcceptedPetsConfigType = {
    dog: true,
    cat: true,
    rabbit: false,
  };
  const config3: AcceptedPetsConfigType = {
    hamster: true,
  };
}

/**
 * Create a function type that will handle the response
 */
async function Exercise5() {
  type ResponseHandler = (items: XYZ) => XYZ;
  const responseHandler: ResponseHandler = (items) => {
    return items.some((i) => i.access);
  };

  // We have limited access to fetchItems - use FetchItemsResultType
  const result = await fetchItems().then((value) =>
    responseHandler(value.items),
  );
}

/**
 * Define type C that is the result of A & B
 */
function Exercise6() {
  type A = {
    x: string | number;
    y: number;
  };
  type B = {
    x: number;
    y?: number;
    z?: 0 | 1;
  };
  type C = {};
}

/**
 * Some inspection of the types inside IDE
 * Use some unique features of specific value type in console.log
 */
function Exercise7() {
  type A = {
    action: "post";
    value: number;
  };
  type B = {
    action: "delete";
    value: { id: number }[];
  };
  function generateAction(): A | B {
    return Math.random() > 0.5
      ? {
          action: "delete",
          value: [{ id: 1 }, { id: 3 }],
        }
      : {
          action: "post",
          value: 100,
        };
  }

  const { action, value } = generateAction();
  if (action === "delete") {
    // Check the type of the value
    console.log(`Some unique method for this value type: ${value}`);
  } else {
    // Check the type of the value
    console.log(`Some unique method for this value type: ${value}`);
  }
}

/**
 * Fix type errors using following techniques:
 * 1. Remove type definition - we don't need to specify this variable shape
 * 2. Limit keys to needed
 */
function Exercise8() {
  type AuthorType = { name: string; surname: string };
  const displayAuthor = (author: AuthorType) => {
    console.log(`Author: ${author.name} ${author.surname}`);
  };

  const myFavoriteAuthor: AuthorType = {
    name: "Brandon",
    surname: "Sanderson",
    age: 47,
  };
  const withSecondName: AuthorType = {
    ...myFavoriteAuthor,
    name: "Brandon Winn",
  };

  displayAuthor(myFavoriteAuthor);
  displayAuthor(withSecondName);
}
