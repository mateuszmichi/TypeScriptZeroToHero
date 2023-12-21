import {
  Exercise1,
  Exercise2,
  Exercise3,
  Exercise4,
  Exercise5,
} from "./exercises";
import { Template } from "./externalLibMock";

describe("Exercise1", () => {
  it("Works for primitive values", async () => {
    expect(Exercise1(100)).resolves.toBe(100);
    expect(Exercise1("100")).resolves.toBe("100");
  });

  it("Works for promises", async () => {
    expect(Exercise1(Promise.resolve(100))).resolves.toBe(100);
  });
});

describe("Exercise2", () => {
  it("Works for basic template", async () => {
    const JSONTemplate: Template<{ name: string }> = (data) =>
      JSON.stringify(data);
    expect(
      Exercise2(JSONTemplate, { name: "Hello" }, ["test@gmail.com"]),
    ).resolves.toStrictEqual(["872294488"]);
  });

  it("Works for two recipients", async () => {
    const JSONTemplate: Template<{ id: number }> = (data) => data.id.toFixed();
    expect(
      Exercise2(JSONTemplate, { id: 200 }, [
        "test@gmail.com",
        "other@gmail.com",
      ]),
    ).resolves.toStrictEqual(["-1011762481", "-169018095"]);
  });
});

describe("Exercise3", () => {
  it("Works for number to string", async () => {
    expect(Exercise3([100, 200], (num) => num.toFixed())).toStrictEqual([
      "100",
      "200",
    ]);
  });

  it("Works for undefined to null clearing", async () => {
    expect(
      Exercise3([{ id: 1000 }, undefined, null, { id: 2001 }], (item) =>
        item === undefined ? null : item,
      ),
    ).toStrictEqual([{ id: 1000 }, null, null, { id: 2001 }]);
  });
});

describe("Exercise4", () => {
  it("Can compare items", async () => {
    expect(
      Exercise4(
        { name: "name", surname: "surname", age: 100, score: 100 },
        { title: "Sir", surname: "Pratchet", score: 100 },
      ),
    ).toStrictEqual({
      added: { title: "Sir" },
      common: { score: 100 },
      deleted: { age: 100, name: "name" },
      modified: {
        surname: { next: "Pratchet", prev: "surname" },
      },
    });
  });

  it("Works with undefined", async () => {
    expect(
      Exercise4(
        { name: "name", surname: "surname" },
        { name: "anon", surname: undefined },
      ),
    ).toStrictEqual({
      added: {},
      common: {},
      deleted: { surname: "surname" },
      modified: {
        name: { next: "anon", prev: "name" },
      },
    });
  });
});

describe("Exercise5", () => {
  it("Works with example", async () => {
    type StateMachine = {
      init: {};
      loading: { timeout: number };
      submit: { id: number; username: string };
      confirmation: { success: boolean };
      error: {};
    };
    const { move, getState } = Exercise5<StateMachine>({ step: "init" });
    move({ step: "loading", data: { timeout: 300 } });
    move({ step: "submit", data: { id: 102, username: "mocked" } });
    move({ step: "confirmation", data: { success: false } });
    expect(getState()).toStrictEqual({
      step: "confirmation",
      data: { success: false },
    });
    move({ step: "error" });
    expect(getState()).toStrictEqual({ step: "error" });
  });
});
