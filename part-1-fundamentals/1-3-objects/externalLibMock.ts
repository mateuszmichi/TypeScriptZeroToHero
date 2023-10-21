export type FetchItemsResultType = {
  numberOfItems: number;
  items: Array<{ id: number; access: boolean }>;
};

/**
 * Use FetchItemsResultType import
 * @returns FetchItemsResultType response
 */
export const fetchItems = (): Promise<FetchItemsResultType> => {
  return Promise.resolve({
    numberOfItems: 2,
    items: [
      { id: 1, access: true },
      { id: 2, access: false },
    ],
  });
};
