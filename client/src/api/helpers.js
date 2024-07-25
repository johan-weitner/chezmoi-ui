import { APP_FORM } from "constants/appForm";
import { appModelInstallerFields } from "api/appModel";

const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

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
  });
  if (app.tags?.length > 0) {
    entity.tags = JSON.stringify(app.tags);
  }
  DEBUG && console.log(`Mapped app data:
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