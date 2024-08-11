import { log } from 'utils/logger';
/**
 * The YAML to JSON conversion - like JSON - can't have nodes referencing eachother.
 * Instead, the referenced node is copied to the node that references it, creating
 * redundancy. So we need to process the JSON data and reverse-engineer the nodes
 * with redundat data and restore the references to the original nodes.
 * Due to the structure of Install.Doctor's data, it's done recursively
 */

export const processMetaGroups = (data) => {
  if (!data || typeof data !== 'object') {
    log.debug("Invalid data: ", data);
    return data;
  }

  const groupMap = {};

  for (const [group, items] of Object.entries(data)) {
    if (!Array.isArray(items) || items.length === 0 || typeof items[0] !== 'string') continue;
    groupMap[JSON.stringify(items.flat())] = group;
  }

  const replaceArrayWithGroupReference = (metaGroup) => {
    for (let i = 0; i < metaGroup.length; i++) {
      if (Array.isArray(metaGroup[i])) {
        const arrayString = JSON.stringify(metaGroup[i]);
        if (groupMap[arrayString]) {
          metaGroup[i] = `_${groupMap[arrayString]}`;
        } else {
          replaceArrayWithGroupReference(metaGroup[i]);
        }
      }
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
      replaceArrayWithGroupReference(value);
    }
  }
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => key[0] !== '_'));
}

export const testProcessMetaGroups = () => {
  const dataset = {
    group1: ["item1", "item2", "item3"],
    group2: ["item4", "item5", "item6"],
    group3: ["item7", "item8", "item9"],
    group4: ["item10", "item11", "item12"],
    metaGroup1: [["item1", "item2", "item3"], ["item4", "item5", "item6"]],
    metaGroup2: [["item7", "item8", "item9"], ["item10", "item11", "item12"]],
    superMetaGroup: [[["item1", "item2", "item3"], ["item4", "item5", "item6"]], [["item7", "item8", "item9"], ["item10", "item11", "item12"]]]
  };

  const expectedOutput = {
    group1: ["item1", "item2", "item3"],
    group2: ["item4", "item5", "item6"],
    group3: ["item7", "item8", "item9"],
    group4: ["item10", "item11", "item12"],
    metaGroup1: ["_group1", "_group2"],
    metaGroup2: ["_group3", "_group4"],
    superMetaGroup: ["_group1", "_group2", "_group3", "_group4"],
  };

  // const processedData = processMetaGroups(dataset);

  // consolee.assert(JSON.stringify(processedData) === JSON.stringify(expectedOutput), "Test failed");
  // log.info("Test passed");
};

