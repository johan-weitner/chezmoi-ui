const unwanted = [
	"_envchain:deps",
	"_kde",
	"_misc-flatpaks",
	"_nautilus-extensions",
];

export const filterUnwantedKeys = (software) => {
	return Object.keys(software).filter((item) => !unwanted.includes(item));
};

export const filterUnwantedNodes = (software) => {
	const keys = filterUnwantedKeys(software);
	return keys.reduce((acc, key) => {
		acc[key] = software[key];
		return acc;
	}, {});
};
