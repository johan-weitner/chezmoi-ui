import fs from "node:fs";
import YAML from "yaml";
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

export const setupFileData = () => {
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
