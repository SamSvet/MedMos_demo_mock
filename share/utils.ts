export const randomInteger = (min: number, max: number) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const randomIntegerList = (len: number, min: number, max: number) => {
  if (!len || len < 0) return [];
  let list: number[] = [];
  for (let i = 0; i < len; i++) {
    list.push(randomInteger(min, max));
  }
  return list;
};

export const splitNumber = (totalNumber: number, partsCount: number) => {
  const result = new Array(partsCount).fill(0);
  let sumParts = 0;
  for (let i = 0; i < result.length; i++) {
    const remain = totalNumber - sumParts;
    let pn = 0;
    if (i < result.length - 1) {
      pn = Math.ceil(Math.random() * remain);
      const remainPart = Math.ceil(remain / 3);
      pn = pn > remainPart ? remainPart : pn;
    } else {
      pn = remain;
    }
    result[i] = pn;
    sumParts += pn;
  }
  return result;
};

export const randomDate = () => {
  const start = new Date(2015, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .replace(/Z$/g, "+03:00");
};

export const randomDateBetween = (
  start_dt: Date = new Date(2015, 0, 1),
  end_dt: Date = new Date()
) => {
  return new Date(
    start_dt.getTime() + Math.random() * (end_dt.getTime() - start_dt.getTime())
  )
    .toISOString()
    .replace(/Z$/g, "+03:00");
};

export const currentDate = () => {
  return new Date().toISOString();
};

export function* range(
  start: number,
  end: number
): Generator<number, undefined, unknown> {
  yield start;
  if (start >= end) return;
  yield* range(start + 1, end);
}

export const randomString = (
  length: number,
  characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) => {
  const charactersLength = characters.length;
  return [...range(1, length)].reduce((acc) => {
    const newChar = characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
    return acc + newChar;
  }, "");
};
