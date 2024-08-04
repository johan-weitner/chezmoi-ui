import { getAllApps, getAllAppsWithTags, getAppsByTag, getGroupedApplications } from "../db/prisma.js";
import { log } from "./logger.js";

export const getYamlExport = async () => {
	// const apps = await getAllApps();
	const apps = await getAllAppsWithTags();
	log.debug(apps);
	const output = formatYaml(apps);
	return output;
};

export const getFilteredYamlExport = async (tags) => {
	const apps = await getAppsByTag(tags);
	const output = formatYaml(apps);
	return output;
};

export const getInstallDoctorExport = async () => {
	const groups = await getGroupedApplications();
	return formatInstallDoctorYaml(groups);
};

const formatYaml = (apps) => {
	const output = { softwarePackages: [] };

	for (const app of apps) {
		const {
			id,
			key,
			name,
			edited,
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
				tags: appTags.map(tag => tag.tag.name),
			},
		});
	}

	return output;
};

const formatInstallDoctorYaml = (groups) => {
	const softwareGroups = [];

	for (const group of groups) {
		const {
			name, apps
		} = group;

		softwareGroups.push({
			[name]: apps.map(app => app.application.name),
		});
	}
	return { softwareGroups: softwareGroups };
};