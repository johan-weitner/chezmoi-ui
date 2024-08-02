import {
	addAppTags,
	deleteApp,
	deleteAppTag,
	fetchApp,
	getAllApps,
	getAllTags,
	getTagsByAppId,
	saveNewApp,
	updateApp,
} from "api/appCollectionApi";
import { filterModel } from "api/filters";
import { useEffect } from "react";
import { toast } from "sonner";
import {
	getNextKey,
	getPreviousKey,
	selectAppByKey,
	selectPageContent,
} from "store/selectors";
import { rootStore } from "store/store";
import { transformNullValues } from "api/helpers";

export const useClientManager = () => {
	const { store } = rootStore;
	const state = store.getState();
	const { page, pageCount, getTotalSize } = state;
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
};
