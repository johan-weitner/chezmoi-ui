const DARWIN = "darwin";
const LINUX = "linux";
const WINDOWS = "windows";

/**
 * An array of operating system constants representing the supported platforms.
 */
export const OS = [DARWIN, LINUX, WINDOWS];

/**
 * An object containing various subcategories for software installation and management.
 *
 * @property {string} taps - Homebrew taps
 * @property {string} brews - Homebrew formulaes
 * @property {string} casks - Homebrew casks
 * @property {string} binaries - Binary installers
 * @property {string} cargo - Rust packages
 * @property {string} commands - Install by commands
 * @property {string} gem - Ruby gems
 * @property {string} git - Git repos
 * @property {string} mas - Mac App Store apps
 * @property {string} pip - Python packages
 * @property {string} pipx - Python packages (pipx)
 * @property {string} pre - Prerequisites
 * @property {string} scripts - Installer scripts
 * @property {string} go - Go installers
 * @property {string} node - NPM modules
 */
export const SUBCAT = {
	taps: "Homebrew taps",
	brews: "Homebrew formulaes",
	casks: "Homebrew casks",
	binaries: "Binary installers",
	cargo: "Rust packages",
	commands: "Install by commands",
	gem: "Ruby gems",
	git: "Git repos",
	mas: "Mac App Store apps",
	pip: "Python packages",
	pipx: "Python packages (pipx)",
	pre: "Prerequisites",
	scripts: "Installer scripts",
	go: "Go installers",
	node: "NPM modules",
};
