export const getStringArray = (arr) => {
	if (!arr) return [];
	return arr.map((item) => item.name);
};

export const nullCheck = (arr) => {
	return arr ? arr : [];
};
