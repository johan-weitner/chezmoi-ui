import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Group, Card, rem, Text, SimpleGrid } from "@mantine/core";
import { rootStore } from "store/store";
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
	const dispatch = useDispatch();
	const [groups, setGroups] = useState(null);
	const [groupKeys, setGroupKeys] = useState(null);

	const appGroups = useSelector((state) => state.root.appGroups);
	const appGroupKeys = useSelector((state) => state.root.appGroupKeys);
	const selectedGroupId = useSelector((state) => state.root.selectedGroupId);

	useEffect(() => {
		setGroups(appGroups);
		setGroupKeys(appGroupKeys);
	}, [appGroups, appGroupKeys]);

	const deleteItem = () => {};
	const editItem = () => {};

	return (
		<>
			{/* // <Container
		// 	size="lg"
		// 	p={0}
		// 	padding={0}
		// 	style={{
		// 		backgroundColor: "#2e2e2e",
		// 	}}
		// > */}
			{/* <Card size="lg" shadow="lg" radius="md" padding="0" ta="left"> */}
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
					{selectedGroupId ? (
						<ListView isGroupView={true} />
					) : (
						<GroupList deleteItem={deleteItem} editItem={editItem} />
					)}
				</ErrorBoundary>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					{(selectedGroupId && <GroupDetailView />) || <Legend />}
				</ErrorBoundary>
			</SimpleGrid>
			{/* </Card> */}
			{/* // </Container> */}
		</>
	);
};

export default ApplicationGroupView;
