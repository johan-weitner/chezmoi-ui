import { createSelector } from "reselect";
import { isStartOfPage, isEndOfPage, findIndex } from "utils/pageUtils";

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;

// Raw selectors
const selectApp = (state) => {
	const { selectedAppKey, allApps } = state;
	return allApps.find((app) => app.key === selectedAppKey);
};

const selectAppByKey = (state, key) => {
	const { allApps } = state;
	return allApps.find((app) => app.key === key);
};

const selectAllApps = (state) => state.allApps;

const getSelectedAppKey = (state) => state.selectedAppKey;

const selectPage = (state) => state.pageContent;

const selectPrevPage = (state) => {
	const { page: currentPage } = state;
	if (currentPage === 1) {
		return;
	}
	return selectSpecificPage(state, page - 1);
};

const selectNextPage = (state) => {
	const { page: currentPage, pageCount } = state;
	if (currentPage === pageCount) {
		return;
	}
	return selectSpecificPage(state, page + 1);
};

const selectSpecificPage = (state, page) => {
	const { allApps } = state;
	const skip = page === 1 ? 0 : (page - 1) * PAGE_SIZE;
	return Array.isArray(allApps) && allApps?.slice(skip, skip + PAGE_SIZE);
};

const selectMetaData = (state) => {
	const { page, totalCount, pageCount } = state;
	return { page, totalCount, pageCount };
};

// Memoized selectors

const memoizedSelectApp = createSelector(
	[selectAllApps, getSelectedAppKey],
	(allApps, selectedAppKey) => {
		console.log("--- memoizedSelectApp ---");
		return allApps.find((app) => app.key === selectedAppKey);
	},
);

const memoizedSelectPage = createSelector([selectPage], (pageContent) => {
	console.log("--- memoizedSelectPage ---");
	return pageContent;
});

const memoizedSelectAppByKey = createSelector(
	[(state) => state.allApps],
	(allApps, key) => {
		console.log("--- memoizedSelectAppByKey ---");
		return allApps.find((app) => app.key === key);
	},
);

const memoizedSelectAllApps = createSelector(
	[(state) => state.allApps],
	(allApps) => {
		console.log("--- memoizedSelectAllApps ---");
		return allApps;
	},
);

const memoizedSelectSpecificPage = (state, page) => {
	return createSelector([(state) => state.allApps], (allApps, page) => {
		console.log("--- memoizedSelectSpecificPage ---");
		const skip = page === 1 ? 0 : (page - 1) * PAGE_SIZE;
		return Array.isArray(allApps) && allApps?.slice(skip, skip + PAGE_SIZE);
	});
};

const memoizedSelectMetaData = (state) => {
	return createSelector(
		[
			(state) => state.page,
			(state) => state.totalCount,
			(state) => state.pageCount,
			(state) => state.selectedAppKey,
		],
		(page, totalCount, pageCount) => {
			console.log("--- memoizedSelectMetaData ---");
			return { page, totalCount, pageCount, selectedAppKey };
		},
	);
};

export {
	selectAllApps,
	selectPage,
	selectPrevPage,
	selectNextPage,
	selectSpecificPage,
	selectMetaData,
	memoizedSelectApp,
	memoizedSelectAppByKey,
	memoizedSelectAllApps,
	memoizedSelectPage,
	memoizedSelectSpecificPage,
	memoizedSelectMetaData,
};
