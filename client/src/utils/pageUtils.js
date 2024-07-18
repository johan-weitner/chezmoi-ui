export const isStartOfPage = (index) => {
  return index === 0;
};

export const isEndOfPage = (index, ofTotalLength) => {
  return index === ofTotalLength - 1;
};

export const findIndex = (key, list) => {
  return list.findIndex((item) => item.key === key);
};