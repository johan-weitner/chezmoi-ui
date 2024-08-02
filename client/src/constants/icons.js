import {
	IconAlertCircle,
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
	IconCheck,
	IconCirclePlus,
	IconDeviceFloppy,
	IconDownload,
	IconEdit,
	IconFilter,
	IconMenu2,
	IconPackages,
	IconPlayerTrackNext,
	IconPlayerTrackPrev,
	IconReload,
	IconScript,
	IconSearch,
	IconTerminal2,
	IconTrash,
	IconWorldCode,
	IconX,
	IconFolders,
	IconArrowRight,
	IconArrowLeft,
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
	check: IconCheck,
	menu: IconMenu2,
	search: IconSearch,
	prev: IconPlayerTrackPrev,
	next: IconPlayerTrackNext,
	filter: IconFilter,
	folders: IconFolders,
	packages: IconPackages,
	arrowRight: IconArrowRight,
	arrowLeft: IconArrowLeft,
};

export const INDICATOR = {
	populated: { css: "green", icon: "✓" },
	unpopulated: { css: "red", icon: "✗" },
	warning: { css: "red", icon: "⚠" },
};
