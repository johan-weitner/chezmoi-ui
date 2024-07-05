const unwanted = [
  "_envchain:deps",
  "_kde",
  "_misc-flatpaks",
  "_nautilus-extensions",
];

/**
 * Filters out unwanted software packages from the provided software object.
 *
 * @param {Object} software - An object containing software packages.
 * @returns {string[]} - An array of software package names that are not in the unwanted list.
 */
export const filterUnwantedKeys = software => {
  return Object.keys(software).filter(
    (item) => !unwanted.includes(item)
  );
};

export const filterUnwantedNodes = software => {
  const keys = filterUnwantedKeys(software);
  // return software minus the nodes that aren't in 'keys'
  return keys.reduce((acc, key) => {
    acc[key] = software[key];
    return acc;
  }, {});

};