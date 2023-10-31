export const fetchData = async (url: string, parse: (resp: any) => string) => {
  return await fetch(url)
    .then((resp) => resp.json())
    .then(parse);
};

export const personalData = {
  name: "string",
  surname: "string",
  birthday: new Date("1990-01-02"),
  address: {
    street: "string",
    postalCode: "string",
    houseNumber: "string",
    city: "string",
  },
};

// Mock file
export type RespType =
  | {
      success: true;
      data: { modifiedItems: number };
    }
  | { success: false; error?: string };

// We are using RespType to make sure our mock will always be of the correct type
export const standardMock: RespType = {
  success: true,
  data: { modifiedItems: 10 },
};
export const satisfiesMock = {
  success: true,
  data: { modifiedItems: 10 },
} satisfies RespType;
