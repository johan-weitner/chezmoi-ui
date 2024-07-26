import { getAllApps } from "../db/prisma.js";

export const getYamlExport = async () => {
	const apps = await getAllApps();
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
		} = app;

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
			},
		});
	}

	return output;
};
