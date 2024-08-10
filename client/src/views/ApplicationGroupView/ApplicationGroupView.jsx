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
		<>
			<Group className={s.groupListHeader}>
				<ICON.packages
					style={{ width: rem(50), height: rem(50) }}
					stroke={2}
					color="#238be6"
					className={commonCss.cardTitleIcon}
				/>
				<Text fz="xl" fw={500} className={s.mainTitle} mt="md">
					Groups
				</Text>
				<Toolbar />
			</Group>

			<SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" py={12}>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					{selectedGroupId ? <ListView isGroupView={true} /> : <GroupList />}
				</ErrorBoundary>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					{(selectedGroupId && <GroupDetailView />) || <Legend />}
				</ErrorBoundary>
			</SimpleGrid>
		</>
	);
};

export default ApplicationGroupView;
