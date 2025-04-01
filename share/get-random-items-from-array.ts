import { randomInteger } from "./utils";

export const getRandomItemsFromArray = <T>(
  itemsArray: T[],
  count: number
): T[] => {
  const indexes: number[] = [];
  while (indexes.length < count) {
    const i = randomInteger(0, itemsArray.length - 1);
    if (indexes.includes(i)) {
      continue;
    }
    indexes.push(i);
  }

  const result = indexes.map((i) => itemsArray[i]);
  return result;
};

export const getRandomItem = <T>(items: T[]) =>
  getRandomItemsFromArray<T>(items, 1)[0];
