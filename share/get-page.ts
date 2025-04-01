import { sanitize } from "./sanitize";

const defaultPageParams = () => ({
  allData: [],
  page: 1,
  pageSize: 10,
});

export const getPage = <T>({
  allData: ad,
  page: p,
  pageSize: ps,
}: {
  allData: T;
  page: number;
  pageSize: number;
}) => {
  let success = true;
  let { allData, page, pageSize } = {
    ...defaultPageParams(),
    ...sanitize({ allData: ad, page: p, pageSize: ps }),
  };
  let realPage = page - 1;

  if (realPage < 0) {
    return {
      page: 0,
      count: 0,
      total: 0,
      pages: 0,
      items: [],
      success: false,
    };
  }

  const total = allData.length;
  let pages = Math.floor(total / pageSize);
  if (total % pageSize !== 0) {
    pages++;
  }

  if (page > pages) {
    success = false;
    page = pages;
    realPage = page - 1;
  }

  const start = realPage * pageSize;
  const end = start + pageSize;

  const items = allData.slice(start, end);
  const result = {
    page,
    count: Math.min(items.length, pageSize),
    total,
    pages,
    items,
    success,
  };
  return result;
};
