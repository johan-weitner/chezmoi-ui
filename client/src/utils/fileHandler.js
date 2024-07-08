const LOCAL_STORE_EDITED_APPS = "LOCAL_STORE_EDITED_APPS";

if (!localStorage.getItem(LOCAL_STORE_EDITED_APPS)) {
	localStorage.setItem(LOCAL_STORE_EDITED_APPS, JSON.stringify([]));
}

export const getMarkedAsEdited = () => {
	const data = localStorage.getItem(LOCAL_STORE_EDITED_APPS);
	if (data !== "undefined") {
		return JSON.parse(data);
	}
	return [];
};

export const saveMarkedAsEdited = (edited) => {
	localStorage.setItem(LOCAL_STORE_EDITED_APPS, JSON.stringify(edited));
};
