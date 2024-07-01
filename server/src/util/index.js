export const getStringArray = arr => {
  return arr.reduce((acc, current) => [...acc, current.name], []);
};

export const nullCheck = arr => {
  return arr ? arr : [];
};