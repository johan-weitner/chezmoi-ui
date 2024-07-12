import fs from "node:fs";
import YAML from "yaml";
import {
	getCount,
	getCount2,
	getTagCount,
	isEmptyDb,
	seedDb,
	seedDb2,
} from "../db/prisma.js";
import { log } from "../util/log.js";
import { styles } from "../util/styles.js";
import { softwareYamlPath } from "./config.js";
import { printAppLogo } from "./logo.js";

export const { success, warn, error, bold, italic, check, cross, wsign } =
	styles;

export const boot = () => {
	printAppLogo();
	log.info("  © 2024 Johan Weitner");
	log.info(bold("\n\n-= STARTING BACKEND SERVER... =-\n"));

	_checkEnvVars();
	const { sourceExists } = _checkFileExistence();

	log.info(bold("Path to source file: ") + softwareYamlPath);
	sourceExists
		? log.success(`Found ${check} \n`)
		: log.error(`Not found ${cross} \n`);

	_seedDbIfEmpty();
};

const _checkEnvVars = () => {
	if (!softwareYamlPath) {
		log.error(error("Missing environment variable"));
		log.error(
			error(
				"Please set SOURCE_FILE in either a .env file or in your environment",
			),
		);
		process.exit(1);
	}
};

const _checkFileExistence = () => {
	const sourceExists = fs.existsSync(softwareYamlPath);

	if (!sourceExists) {
		log.error(error("Source file is missing"));
		log.error(
			error(
				"\x1b[31m%s\x1b[0m",
				"Please point SOURCE_FILE to an existing file",
			),
		);
		process.exit(1);
	}

	return { sourceExists };
};

const _setupFileData = () => {
	let software = [];
	const softwareArray = [];
	let keys = [];

	log.info(softwareYamlPath);
	const softwareYaml = fs.readFileSync(softwareYamlPath, "utf8");
	software = YAML.parse(softwareYaml).softwarePackages;
	keys = Object.keys(software);

	for (let i = 0; i < keys.length; i++) {
		softwareArray.push(software[keys[i]]);
		softwareArray[i].key = keys[i];
	}
	console.log(italic(`List size: ${keys.length}`));

	return { softwareArray, software, keys };
};

const stripTrailingWhitespace = (str) => {
	if (!str || typeof str !== "string") return "";
	return str.replace(/\s+$/, "");
};

const _seedDbIfEmpty = async () => {
	log.info("Set up db connection...");
	const emptyDb = await isEmptyDb();

	if (emptyDb) {
		log.info("Empty db - seeding tables...");
		const { software, keys } = _setupFileData();
		const data = [];
		const data2 = [];
		keys.forEach((key, index) => {
			data.push({ key: key, JSON: JSON.stringify(software[key]) });
			data2.push({
				key: stripTrailingWhitespace(software[key].key),
				name: stripTrailingWhitespace(software[key]._name),
				edited: stripTrailingWhitespace(software[key].edited),
				desc: stripTrailingWhitespace(software[key]._desc),
				bin: stripTrailingWhitespace(software[key]._bin),
				short: stripTrailingWhitespace(software[key]._short),
				home: stripTrailingWhitespace(software[key]._home),
				docs: stripTrailingWhitespace(software[key]._docs),
				github: stripTrailingWhitespace(software[key]._github),
				whalebrew: stripTrailingWhitespace(software[key].whalebrew),
				apt: stripTrailingWhitespace(software[key].apt),
				brew: stripTrailingWhitespace(software[key].brew),
				cask: stripTrailingWhitespace(software[key].cask),
				cargo: stripTrailingWhitespace(software[key].cargo),
				npm: stripTrailingWhitespace(software[key].npm),
				pip: stripTrailingWhitespace(software[key].pip),
				pipx: stripTrailingWhitespace(software[key].pipx),
				gem: stripTrailingWhitespace(software[key].gem),
				script: stripTrailingWhitespace(software[key].script),
				choco: stripTrailingWhitespace(software[key].choco),
				scoop: stripTrailingWhitespace(software[key].scoop),
				winget: stripTrailingWhitespace(software[key].winget),
				pkgdarwin: stripTrailingWhitespace(software[key].pkgdarwin),
				ansible: stripTrailingWhitespace(software[key].ansible),
				binary: stripTrailingWhitespace(software[key].binary),
				yay: stripTrailingWhitespace(software[key].yay),
				appstore: stripTrailingWhitespace(software[key].appstore),
				pacman: stripTrailingWhitespace(software[key].pacman),
				port: stripTrailingWhitespace(software[key].port),
			});
		});
		log.info(Object.keys(data2[0]));
		await seedDb(data);
		await seedDb2(data2);
		await getCount().then((count) => {
			log.info(`Done seeding App table with ${count} apps`);
		});
		await getCount2().then((count) => {
			log.info(`Done seeding Application table with ${count} apps`);
		});
		await seedTags(tags);
		await getTagCount().then((count) => {
			log.info(`Done seeding Tag table with ${count} tags`);
		});
	}
};
