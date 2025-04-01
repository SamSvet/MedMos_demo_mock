export const sanitize = (
  obj: { [key: string]: unknown } = {},
  isRemoveEmptyArrays: boolean = false
) => {
  const isEmptyArray = (value: unknown | unknown[]) =>
    value instanceof Array && value.length === 0;

  const result = Object.keys(obj).reduce(
    (res: { [key: string]: unknown }, key) => {
      if (
        (isRemoveEmptyArrays && isEmptyArray(obj[key])) ||
        obj[key] === undefined
      ) {
        return res;
      }

      res[key] = obj[key];
      return res;
    },
    {}
  );

  return result;
};
