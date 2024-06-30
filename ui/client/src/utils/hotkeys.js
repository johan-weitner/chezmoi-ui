import { useHotkeys } from "react-hotkeys-hook";

export const initHotKeys = (setIsPopoverOpen, gotoPrev, gotoNext) => {
	useHotkeys("esc", () => setIsPopoverOpen(false));
	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
};
