import fs from "node:fs";
import { softwareYamlPath } from "./config.js";

export const isEmpty = (data) => {
	return Object.keys(data).length === 0;
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

export const paginate = (list, page_size, page_number) => {
	return list.slice((page_number - 1) * page_size, page_number * page_size);
};
