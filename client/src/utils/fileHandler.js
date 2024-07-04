
const LOCAL_STORE_EDITED_APPS = 'LOCAL_STORE_EDITED_APPS';

if (!localStorage.getItem(LOCAL_STORE_EDITED_APPS)) {
  localStorage.setItem(LOCAL_STORE_EDITED_APPS, JSON.stringify([]));
}

export const getMarkedAsEdited = () => {
  const data = localStorage.getItem(LOCAL_STORE_EDITED_APPS);
  console.log("JSON: ", typeof data)
  // return json ? JSON.parse(json) : [];
  if (data !== 'undefined') {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const saveMarkedAsEdited = (edited) => {
  localStorage.setItem(LOCAL_STORE_EDITED_APPS, JSON.stringify(edited));
};