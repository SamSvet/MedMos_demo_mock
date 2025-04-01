import { RefBook } from "../../share/interfaces";

const activityGroups: RefBook[] = [
  {
    internal_code: "1.1",
    name: "NBO",
    is_deleted: false,
  },
  {
    internal_code: "1.2",
    name: "Information",
    is_deleted: true,
  },
];

export const ACTIVITY_GROUPS = activityGroups.map((x) => {
  return {
    ...{
      internal_code: "",
      name: "",
      is_deleted: false,
    },
    ...x,
  };
});
