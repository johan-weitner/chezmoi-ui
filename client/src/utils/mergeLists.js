export const mergeLists = (allApps, softwarePackages) => {
	const unwanted = [
		"_envchain:deps",
		"_kde",
		"_misc-flatpaks",
		"_nautilus-extensions",
	];

	const softwareKeys = Object.keys(softwarePackages)
		.filter((item) => !unwanted.includes(item))
		.sort();
	const softwareNames = [];
	for (const key of softwareKeys) {
		softwareNames.push(softwarePackages[key]?.name?.toLowerCase());
	}
	const mergedPkgs = merged.softwarePackages;
	const mergedKeys = Object.keys(mergedPkgs)
		.filter((item) => !unwanted.includes(item))
		.sort();

	const mergedArray = [];
	const hits = [];
	allApps.sort().map((item) => {
		if (
			softwareNames.includes(item?.toLowerCase()) ||
			softwareKeys.includes(item?.toLowerCase())
		) {
			mergedArray.push({ [item]: softwarePackages[item] });
			hits.push(softwarePackages[item]);
		} else {
			mergedArray.push({
				[item]: {
					_name: item,
					_bin: item,
					_desc: null,
					_docs: null,
					_github: null,
					_home: null,
					_short: null,
				},
			});
		}
	});

	return mergedArray;
};
