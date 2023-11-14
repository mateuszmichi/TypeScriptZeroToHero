// Types vs interface

import { handleRequest } from "./externalLibMock";

/**
 * Change type into interface
 */
function Exercise1() {
  type AuthorType = {
    name: string;
    surname: string;
    birthdate?: Date;
    getBooks: () => Promise<{ id: number }[]>;
  };

  const author: AuthorType = {
    name: "name",
    surname: "surname",
    birthdate: new Date("2000-01-01"),
    getBooks: () => Promise.resolve([{ id: 1 }]),
  };
}

declare module "./externalLibMock" {
  // Here declaration merging would go
  // for external imports
}

/**
 * Use declaration merging to extend Request
 * Context: we want to apply user into the request
 * inside middleware function
 */
async function Exercise2() {
  const request = await handleRequest({ url: "/some/url" }, (req) => {
    req.user = { username: "string" };
  });

  if (request.user) {
    console.log(request.user.username);
  }
}
