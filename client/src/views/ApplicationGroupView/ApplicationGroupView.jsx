import { Group, SimpleGrid, Text, rem } from "@mantine/core";
import { useSelector } from "store/store";
import "../../common.css";
import FallbackComponent from "components/FallbackComponent";
import { ICON } from "constants/icons";
import { ErrorBoundary } from "react-error-boundary";
import ListView from "views/ListView/ListView";
import commonCss from "views/ListView/ListView.module.css";
import GroupDetailView from "./GroupDetailView";
import GroupList from "./GroupList";
import s from "./GroupView.module.css";
import Legend from "./Legend";
import Toolbar from "./Toolbar";

const ApplicationGroupView = (props) => {
	const selectedGroupId = useSelector((state) => state.root.selectedGroupId);

	return (
		<SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" py={12}>
			<ErrorBoundary
				fallbackRender={(error) => <FallbackComponent error={error.message} />}
			>
				{selectedGroupId ? <ListView isGroupView={true} /> : <GroupList />}
			</ErrorBoundary>
			<ErrorBoundary
				fallbackRender={(error) => <FallbackComponent error={error.message} />}
			>
				{(selectedGroupId && <GroupDetailView />) || <Legend />}
			</ErrorBoundary>
		</SimpleGrid>
	);
};

export default ApplicationGroupView;
