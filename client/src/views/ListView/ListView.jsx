import { Card } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { useClientManager } from "core/ClientManager";
import { ErrorBoundary } from "react-error-boundary";
import { useHotkeys } from "react-hotkeys-hook";
import List from "./List";
import commonCss from "./ListView.module.css";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";

const ListView = (props) => {
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

	useBootstrap();
	useHotkeys("alt + b", () => selectPrevApp());
	useHotkeys("alt + n", () => selectNextApp());
	useHotkeys("alt + left", () => selectPrevApp());
	useHotkeys("alt + right", () => selectNextApp());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => clearAppSelection());

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				{!isGroupView && <ListViewHeader />}
				<div
					style={{
						marginTop: "-30px",
						marginBottom: "-20px",
						zIndex: "999999",
					}}
				>
					<PaginationBar gotoPage={gotoPage} />
				</div>
				<List deleteItem={deleteItem} editItem={editItem} />
			</Card>
		</ErrorBoundary>
	);
};

// ListView.whyDidYouRender = true;
export default ListView;
