import fs from "node:fs";
import YAML from "yaml";
import { tags } from "../db/fixtures/tags.js";
import {
	getCount,
	getTagCount,
	isEmptyDb,
	seedDb,
	seedTags,
	seedGroups,
	getGroupCount
} from "../db/dbService.js";
import { styles } from "../util/styles.js";
import { dbUrl, softwareYamlPath, softwareGroupYamlPath } from "./config.js";
import { printAppLogo } from "./logo.js";
import { log } from "../util/log.js";

export const { success, warn, error, bold, italic, check, cross, wsign } =
	styles;

export const initialize = () => {
	printAppLogo();
	log.info("  © 2024 Johan Weitner");
	log.info(bold("\n\n-= STARTING BACKEND SERVER... =-\n"));

	_checkEnvVars();
	_checkDbExists();
	const { sourceExists } = _checkFileExistence();

	log.info(bold("\nPath to apps source file: ") + softwareYamlPath);
	log.info(bold("Path to groups source file: ") + softwareGroupYamlPath);
	sourceExists
		? log.success(`${check} Found \n`)
		: log.warn("! One or both files missing - skipping seeding db\n");

	sourceExists && _seedDbIfEmpty();
};

export const _checkEnvVars = () => {
	if (!softwareYamlPath || !softwareGroupYamlPath) {
		log.warn(warn("Missing environment variable"));
		log.warn(
			warn(
				"\x1b[31m%s\x1b[0m",
				"If you want to seed the database, please set SOURCE_FILE and SOURCE_GRP_FILE \
				in either a .env file or in your environment",
			),
		);
	}
};

export const _checkFileExistence = () => {
	const sourceExists =
		fs.existsSync(softwareYamlPath) && fs.existsSync(softwareGroupYamlPath);
	return { sourceExists };
};

const _checkDbExists = () => {
	if (!fs.existsSync(dbUrl.replace("file:", ""))) {
		log.error(error("Database is missing"));
		log.error(
			error(
				"\x1b[31m%s\x1b[0m",
				"Could not find database file at",
				dbUrl
			),
		);
		log.info("Exiting...\n")
		process.exit(1);
	} else {
		log.info(`${bold("Database URL is set to:")} ${dbUrl}`);
	}
};

export const _setupFileData = () => {
	let software = [];
	const softwareArray = [];
	let keys = [];

	const softwareYaml = fs.readFileSync(softwareYamlPath, "utf8");
	software = YAML.parse(softwareYaml).softwarePackages;
	keys = Object.keys(software);

	const softwareGroupYaml = fs.readFileSync(softwareGroupYamlPath, "utf8");
	const groups = YAML.parse(softwareGroupYaml).softwareGroups;
	const groupKeys = Object.keys(software);

	for (let i = 0; i < keys.length; i++) {
		softwareArray.push(software[keys[i]]);
		softwareArray[i].key = keys[i];
	}
	log.info(italic(`List size: ${keys.length}`));

	return { softwareArray, software, keys, groups, groupKeys };
};

export const setupGroupData = () => {
	let groups = [];
	let groupKeys = [];
	const softwareGroupYaml = fs.readFileSync(softwareGroupYamlPath, "utf8");
	groups = YAML.parse(softwareGroupYaml)?.softwareGroups;
	groupKeys = groups && Object.keys(groups);
	log.info(italic(`Group list size: ${groupKeys?.length}`));

	return { groups, groupKeys };
};

export const stripTrailingWhitespace = (str) => {
	if (!str || typeof str !== "string") return "";
	return str.replace(/\s+$/, "");
};

export const _seedDbIfEmpty = async (forceSeed) => {
	log.info("Set up db connection...");
	const emptyDb = forceSeed || await isEmptyDb();

	if (emptyDb) {
		log.info("Empty db - seeding tables...");
		const { software, keys } = _setupFileData();
		const data = mapDataSeed(keys, software);
		await seedDb(data);
		getCount().then((count) => {
			log.info(`Done seeding Application table with ${count} apps`);
		});
		doSeedGroups();
		doSeedTags();
	}
};

export const mapDataSeed = (keys, software) => {
	const data = [];
	for (const key of keys) {
		if (!software[key]) continue;
		data.push({
			key: stripTrailingWhitespace(software[key].key),
			name: stripTrailingWhitespace(software[key]._name),
			edited: false,
			done: false,
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
	}
	return data;
};

const doSeedGroups = async () => {
	const { groups } = _setupFileData();
	if (!groups) {
		return;
	}
	const groupData = Object.keys(groups)
		.filter((key) => key.indexOf("_") !== 0)
		.map((key) => {
			return {
				name: key
			};
		});
	await seedGroups(groupData);
	getGroupCount().then((count) => {
		log.info(`Done seeding Group table with ${count} groups`);
	});
};

const doSeedTags = async () => {
	await seedTags(tags);
	getTagCount().then((count) => {
		log.info(`Done seeding Tag table with ${count} tags`);
	});
};