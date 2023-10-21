// Object Types

import { fetchItems, FetchItemsResultType } from "./externalLibMock";

// Replace all existing occurrences of this type with proper types
type XYZ = unknown;

function Exercise1() {
  // Define AuthorType to match the following types
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

function Exercise2() {
  // Define ActionHandlerType to match the following types
  type HandlerType = XYZ;

  const actionHandler1: HandlerType = {
    handler: (response: string, context: any) => `${response} ${context}`,
  };
  const actionHandler2: HandlerType = {
    handler: (response: string) => console.log(response),
  };
}

function Exercise3() {
  type LanguageType = "en" | "de" | "fr";
  // Define ActionHandlerType to create the following types
  type TranslationMapper = XYZ;

  function translateText(
    key: string,
    language: LanguageType,
    mapper: TranslationMapper,
  ) {
    return mapper[key][language];
  }
}

function Exercise4() {
  // Define AcceptedPetsConfigType
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

async function Exercise5() {
  // Create a function type that will handle the response
  type ResponseHandler = (items: XYZ) => XYZ;
  const responseHandler: ResponseHandler = (items) => {
    return items.some((i) => i.access);
  };

  // We have limited access to fetchItems - use FetchItemsResultType
  const result = await fetchItems().then((value) =>
    responseHandler(value.items),
  );
}

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
  type C = {
    // Define type C that is the result of A & B
    x: string | number;
    y: number;
    z?: 0 | 1;
  };
}

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
