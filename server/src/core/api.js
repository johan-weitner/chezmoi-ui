import fs from "node:fs";
import { backupPaths } from "./boot.js";
import {
	BACKUP_DEPTH,
	BACKUP_INTERVAL,
	backupBasePath,
	softwareYamlPath,
	targetFilePath,
} from "./config.js";

export const isEmpty = (data) => {
	return Object.keys(data).length === 0;
};

// FIFO container for storing the 5 most recent changes
export const addToBackup = (data) => {
	if (!fs.existsSync(backupBasePath)) {
		fs.mkdirSync(backupBasePath);
	}

	const thisBackupPath = `${backupBasePath}/backup-${new Date().getTime()}.json`;
	try {
		fs.writeFileSync(thisBackupPath, JSON.stringify(data), "utf8");
		backupPaths.unshift(thisBackupPath);
		if (backupPaths.length > BACKUP_DEPTH) {
			fs.unlinkSync(backupPaths.pop());
		}
	} catch (err) {
		console.error(err);
		return;
	}
};

export const readSourceFile = () => {
	const arr = fs.readFileSync(softwareYamlPath, "utf8");
	const data = YAML.parse(arr);
	if (isEmpty(data)) {
		console.error("Something went wrong - work file is empty");
		return;
	}
	return data;
};

export const readWorkFile = () => {
	const arr = fs.readFileSync(targetFilePath, "utf8");
	const data = JSON.parse(arr);
	if (isEmpty(data)) {
		console.error("Something went wrong - work file is empty");
		return;
	}
	return data;
};

export const backupInterval =
	process.env.BACKUP_INTERVAL &&
	process.env.BACKUP_INTERVAL > 0 &&
	setInterval(
		() => {
			const data = readWorkFile();
			addToBackup(data);
		},
		BACKUP_INTERVAL * 60 * 1000,
	);

export const paginate = (list, page_size, page_number) => {
	return list.slice((page_number - 1) * page_size, page_number * page_size);
};
