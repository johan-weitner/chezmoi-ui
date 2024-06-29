/**
 * The form for editing/adding applications to the application list,
 * parted in two, the first represents the mandatory metadata fields,
 * whereas the second represents the different installation sources.
 * It's safe to add fields, the data model self-updates as you continue
 * editing the list. I guess removing works too, though that will leave
 * ghost data hanging in the resulting list. Renaming is probably not
 * a good idea though...
 *
 * This is consumed in the `ui/client/src/components/AppForm.jsx` component.
 */
export const APP_FORM = {
	formPartOne: [
		{ name: "_name", label: "Name" },
		{ name: "key", label: "Key" },
		{ name: "_short", label: "Short desc" },
		{ name: "_home", label: "Homepage" },
		{ name: "_docs", label: "Documentation" },
		{ name: "_github", label: "Github" },
	],
	formPartTwo: [
		{ name: "whalebrew", label: "Whalebrew" },
		{ name: "apt", label: "Apt" },
		{ name: "homebrew", label: "Homebrew" },
		{ name: "cask", label: "Homebrew cask" },
		{ name: "cargo", label: "Cargo" },
		{ name: "npm", label: "NPM" },
		{ name: "pip", label: "Pip" },
		{ name: "pipx", label: "Pipx" },
		{ name: "gem", label: "Gem" },
		{ name: "script", label: "Script" },
		{ name: "choco", label: "Chocolatey" },
		{ name: "scoop", label: "Scoop" },
		{ name: "winget", label: "Winget" },
		{ name: "pkgdarwin", label: "Pkg-Darwin" },
		{ name: "ansible", label: "Ansible" },
		{ name: "binary", label: "Binary" },
		{ name: "yay", label: "Yay" },
		{ name: "appstore", label: "AppStore" },
	],
};
