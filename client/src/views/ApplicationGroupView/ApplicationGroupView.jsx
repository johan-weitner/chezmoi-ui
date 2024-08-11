import { useSelector } from "store/store";
import { Group, rem, Text, SimpleGrid } from "@mantine/core";
import "../../common.css";
import GroupList from "./GroupList";
import GroupDetailView from "./GroupDetailView";
import FallbackComponent from "components/FallbackComponent";
import ListView from "views/ListView/ListView";
import Legend from "./Legend";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "views/ListView/ListView.module.css";
import { ICON } from "constants/icons";
import Toolbar from "./Toolbar";
import s from "./GroupView.module.css";

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
