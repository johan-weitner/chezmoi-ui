import { selectPageContent } from "store/selectors";
import { useSelector, useDispatch } from "react-redux";
import {
	rootStore,
	setPage,
	setPageContent,
	setPageCount
} from "store/store";

export const usePageManager = () => {
	const dispatch = useDispatch();
	const { store } = rootStore;
	const state = store.getState();

	const gotoPage = (page) => {
		dispatch(setPage(page));
		const apps = selectPageContent(state);
		dispatch(setPageContent(apps));
		return apps;
	};

	const getPageContent = () => {
		const apps = selectPageContent();
		dispatch(setPageContent(apps));
		return apps;
	};

	const gotoPrevPage = () => {
		const page = useSelector((state) => state.root.page);
		if (page > 1) {
			dispatch(setPage(page - 1));
			getPageContent();
		}
	};
	const gotoNextPage = () => {
		const page = useSelector((state) => state.root.page);
		const pageCount = useSelector((state) => state.root.pageCount);
		if (page < pageCount) {
			dispatch(setPage(page + 1));
			getPageContent();
		}
	};

	return { gotoPage, getPageContent, gotoPrevPage, gotoNextPage };
};
