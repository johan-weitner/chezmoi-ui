import {
	IconAlertCircle,
	IconBarrel,
	IconBeer,
	IconBinary,
	IconBook,
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
	IconEye,
	IconBox
} from "@tabler/icons-react";

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
	hide: IconEye,
	box: IconBox
};

export const INDICATOR = {
	populated: { css: "green", icon: "✓" },
	unpopulated: { css: "red", icon: "✗" },
	warning: { css: "red", icon: "⚠" },
};
