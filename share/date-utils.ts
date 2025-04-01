import { format } from "date-fns/fp";

export const parseDate = (dateString: string | undefined | null) => {
  if (dateString) {
    const dateArgs = dateString.split("-").map(Number);
    return new Date(dateArgs[0], dateArgs[1] - 1, dateArgs[2]);
  }
};

export const formatDate = (date: Date | undefined | null) =>
  date &&
  [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");

export const dateToStr = (date?: Date | null): string => {
  if (!date) {
    return "";
  }
  const timeZone = "+03:00";
  const formattedDate = format("yyyy-MM-dd'T'HH:mm:ss.SSS", date);
  return formattedDate + timeZone;
};
