import fs from "node:fs";
import { softwareYamlPath } from "./config.js";

export const isEmpty = (data) => {
	return Object.keys(data).length === 0;
};
