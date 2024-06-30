export const initHotKeys = () => {
  useHotkeys("esc", () => setIsPopoverOpen(false));
	useHotkeys("alt + b", () => gotoPrevN());
	useHotkeys("alt + n", () => gotoNext());
};