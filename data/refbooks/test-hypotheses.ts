import { RefBook } from "../../share/interfaces";

const testHypotheses: RefBook[] = [
  {
    internal_code: "1.1",
    name: " 1",
    is_deleted: false,
  },
];

export const TEST_HYPOTHESES = testHypotheses.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
