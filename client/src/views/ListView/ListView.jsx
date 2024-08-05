import React, { useState } from "react";
import { Card, Group, Text, Checkbox } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { useClientManager } from "core/ClientManager";
import { useGroupManager } from "../../core/GroupManager";
import { ErrorBoundary } from "react-error-boundary";
import { useHotkeys } from "react-hotkeys-hook";
import List from "./List";
import commonCss from "./ListView.module.css";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";
import { MAIN_VIEWS } from "store/store";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedGroup, setSelectedGroupKey } from "store/store";

const ListView = (props) => {
	const dispatch = useDispatch();
	// const [hideCompleted, setHideCompleted] = useState(false);
	const { isGroupView } = props;
	const {
		deleteItem,
		editItem,
		addItem,
		selectPrevApp,
		selectNextApp,
		gotoPage,
		gotoPrevPage,
		gotoNextPage,
		useBootstrap,
		clearAppSelection,
	} = useClientManager();
	const { gotoPrevGroup, gotoNextGroup } = useGroupManager();
	const mainView = useSelector((state) => state.root.mainView);

	const returnToGroups = () => {
		if (mainView === MAIN_VIEWS[0]) return;
		dispatch(setSelectedGroup(null));
		dispatch(setSelectedGroupKey(null));
	};

	const gotoPrev = () => {
		mainView === MAIN_VIEWS[0] ? selectPrevApp() : gotoPrevGroup();
	};
	const gotoNext = () => {
		mainView === MAIN_VIEWS[0] ? selectNextApp() : gotoNextGroup();
	};

	const returnToList = () => {
		mainView === MAIN_VIEWS[0] ? clearAppSelection() : returnToGroups();
	};

	// const toggleHideCompleted = () => {
	// 	setHideCompleted(!hideCompleted);
	// 	store.set.hideCompleted(!hideCompleted);
	// };

	useBootstrap();
	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => returnToList());
	useHotkeys("backspace", () => returnToGroups());

	const style =
		mainView === MAIN_VIEWS[1]
			? { marginTop: "-30px", marginBottom: "-20px" }
			: null;

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				{!isGroupView && <ListViewHeader />}
				<div style={{ style }}>
					<PaginationBar gotoPage={gotoPage} />
				</div>
				{/* <Group> // TODO: Implement hideCompleted
					<Checkbox
						checked={hideCompleted}
						onClick={() => toggleHideCompleted()}
					/>
					<Text size="sm" ta={"left"}>
						Hide completed items
					</Text>
				</Group> */}

				<List deleteItem={deleteItem} editItem={editItem} />
			</Card>
		</ErrorBoundary>
	);
};

// ListView.whyDidYouRender = true;
export default ListView;
