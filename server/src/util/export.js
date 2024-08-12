import { getAllApps, getAllAppsWithTags, getAppsByTag, getGroupedApplications } from "../db/dbService.js";
import { log } from "./logger.js";

export const getYamlExport = async () => {
	const apps = await getAllAppsWithTags();
	log.debug(apps);
	const output = formatYaml(apps);
	return output;
};

export const getFilteredYamlExport = async (tags) => {
	const apps = await getAppsByTag(tags);
	log.debug("Export: Filtered apps: ", apps?.length);
	const output = formatYaml(apps);
	return output;
};

export const getInstallDoctorExport = async () => {
	const groups = await getGroupedApplications();
	log.debug("Groups: ", groups.length);
	return formatInstallDoctorYaml(groups);
};

const formatYaml = (apps) => {
	const output = { softwarePackages: [] };

	for (const app of apps) {
		const {
			key,
			name,
			desc,
			bin,
			short,
			home,
			docs,
			github,
			whalebrew,
			apt,
			brew,
			cask,
			cargo,
			npm,
			pip,
			pipx,
			gem,
			script,
			choco,
			scoop,
			winget,
			pkgdarwin,
			ansible,
			binary,
			yay,
			appstore,
			pacman,
			port,
			appTags
		} = app;

		log.debug("App tags: ", appTags);

		output.softwarePackages.push({
			[key]: {
				name,
				desc,
				bin,
				short,
				home,
				docs,
				github,
				whalebrew,
				apt,
				brew,
				cask,
				cargo,
				npm,
				pip,
				pipx,
				gem,
				script,
				choco,
				scoop,
				winget,
				pkgdarwin,
				ansible,
				binary,
				yay,
				appstore,
				pacman,
				port,
				tags: appTags?.map(tag => tag.name),
			},
		});
	}

	return output;
};

const formatInstallDoctorYaml = (groups) => {
	const softwareGroups = [];
	log.debug("Groups: ", groups.length);

	for (const group of groups) {
		const {
			name, Application
		} = group;

		const apps = [];
		for (const app of Application) {
			apps.push(app.name);
		}
		softwareGroups.push({
			[name]: apps,
		});
	}
	log.debug("Software groups: ", softwareGroups);
	return { softwareGroups: softwareGroups };
};