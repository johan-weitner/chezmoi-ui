import { APP_FORM } from "constants/appForm";
import { appModelInstallerFields } from "api/appModel";

/**
 * Helper functions
 */
export const isStartOfPage = (index) => {
  return index === 0;
};

export const isEndOfPage = (index, ofTotalLength) => {
  return index === ofTotalLength - 1;
};

export const findIndex = (key, list) => {
  return list.findIndex((item) => item.key === key);
};

export const isNullOrEmpty = (value) => {
  return value === null || value === undefined || value === "";
};

export const appHasInstaller = (app) => {
  for (const field of appModelInstallerFields) {
    if (app && !isNullOrEmpty(app[field])) {
      return true;
    }
  }
  return false;
};

export const mapEntityToDb = (app) => {
  const { formPartOne, formPartTwo } = APP_FORM;
  const validKeys = [...formPartOne, ...formPartTwo].map((item) => item.name);
  const entity = { tags: app.tags };
  Object.keys(app).map((key) => {
    if (validKeys.includes(key)) {
      entity[key] = app[key];
    }
  }); if (app.tags?.length > 0) {
    entity.tags = JSON.stringify(app.tags);
  }
  console.log(`Mapped app data:
    - Entity:`, entity);
  return entity;
};

export const transformNullValues = (app) => {
  for (const key of Object.keys(app)) {
    if (!app[key]) {
      app[key] = "";
    }
  }
  return app;
};

export const mapTagsToComponent = (tags) => {
  if (!tags) return [];
  if (tags[0]?.label) return tags;
  let tagCollection = tags;
  console.log("Mapping tags to component: ", tagCollection);
  if (typeof tags === "string") {
    tagCollection = JSON.parse(tags);
  }
  console.log("Mapping tags to component: ", tagCollection);
  let i = 0;
  const reMappedTags = Array.isArray(tagCollection) && tagCollection?.map((tag) => {
    return {
      id: ++i,
      label: tag.value || tag.label,
    };
  });
  console.log("Re-mapped tags: ", reMappedTags);
  return JSON.stringify(reMappedTags);
};