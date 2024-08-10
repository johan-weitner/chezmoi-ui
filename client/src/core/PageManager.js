import { selectPageContent } from "store/selectors";
import {
	getState,
	store,
	setPage,
	setPageContent,
} from "store/store";

export const usePageManager = () => {
	const { dispatch } = store;

	const gotoPage = (page) => {
		dispatch(setPage(page));
		const apps = selectPageContent(getState());
		dispatch(setPageContent(apps));
		return apps;
	};

	const getPageContent = () => {
		const apps = selectPageContent();
		dispatch(setPageContent([...apps]));
		return apps;
	};

	const gotoPrevPage = () => {
		const page = getState().page;
		if (page > 1) {
			dispatch(setPage(page - 1));
			getPageContent();
		}
	};
	const gotoNextPage = () => {
		const page = getState().page;
		const pageCount = getState().pageCount;
		if (page < pageCount) {
			dispatch(setPage(page + 1));
			getPageContent();
		}
	};

	return { gotoPage, getPageContent, gotoPrevPage, gotoNextPage };
};
