import { styles } from "./styles.js";

export const { success, warn, error, bold, italic, check, cross, wsign } =
	styles;
export const log = {
	info: (msg) => console.log(msg),
	success: (msg) => console.log(success(msg)),
	warn: (msg) => console.log(warn(msg)),
	error: (msg) => console.log(error(msg)),
};
