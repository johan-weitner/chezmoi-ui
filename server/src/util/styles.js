import { Chalk } from "chalk";

export const customChalk = new Chalk({ level: 2 });
export const styles = {
	success: customChalk.green,
	warn: customChalk.hex("#F59E0B"),
	error: customChalk.red,
	bold: customChalk.bold,
	italic: customChalk.italic,
	check: customChalk.green("✔"),
	cross: customChalk.red("✘"),
	wsign: "⚠️",
};
