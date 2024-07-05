import classes from "components/MainHeader.module.css";
import {
	IconBarrel,
	IconBeer,
	IconBinary,
	IconBook,
	IconBottle,
	IconBrandApple,
	IconBrandGit,
	IconBrandGolang,
	IconBrandNodejs,
	IconBrandPython,
	IconBrandRust,
	IconDeviceFloppy,
	IconEdit,
	IconPackages,
	IconReload,
	IconScript,
	IconTerminal2,
	IconTrash,
	IconWorldCode,
	IconX,
	IconDownload,
	IconCirclePlus,
	IconAlertCircle,
	IconCheck
} from "@tabler/icons-react";

/**
 * An object containing references to various Tabler icons used throughout the application.
 * These icons are used to represent different types of packages, commands, and other application-specific elements.
 */
export const ICON = {
	cargo: IconBrandRust,
	taps: IconBarrel,
	brews: IconBeer,
	casks: IconBarrel,
	binaries: IconBinary,
	commands: IconTerminal2,
	gem: IconPackages,
	git: IconBrandGit,
	mas: IconBrandApple,
	pip: IconBrandPython,
	pipx: IconBrandPython,
	scripts: IconScript,
	go: IconBrandGolang,
	node: IconBrandNodejs,
	allApps: IconWorldCode,
	detail: IconBook,
	edit: IconEdit,
	remove: IconTrash,
	startOver: IconReload,
	save: IconDeviceFloppy,
	close: IconX,
	download: IconDownload,
	add: IconCirclePlus,
	warn: IconAlertCircle,
	check: IconCheck
};

export const INDICATOR = {
	populated: { css: classes.green, icon: '✓' },
	unpopulated: { css: classes.red, icon: '✗' },
	warning: { css: classes.red, icon: '⚠' }
};