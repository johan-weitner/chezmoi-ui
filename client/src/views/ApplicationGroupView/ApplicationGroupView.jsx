import { useState, useEffect } from "react";
import { Container, Group, Card, rem, Text, SimpleGrid } from "@mantine/core";
import { rootStore } from "store/store";
import "../../common.css";
import GroupList from "./GroupList";
import GroupDetailView from "./GroupDetailView";
import FallbackComponent from "components/FallbackComponent";
import ListView from "views/ListView/ListView";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "views/ListView/ListView.module.css";
import { ICON } from "constants/icons";

const ApplicationGroupView = (props) => {
	const [groups, setGroups] = useState(null);
	const [groupKeys, setGroupKeys] = useState(null);

	useEffect(() => {
		setGroups(rootStore.get.appGroups());
		setGroupKeys(rootStore.get.appGroupKeys());
		console.log("groups", JSON.stringify(groups, null, 2));
		console.log("Store: ", rootStore.store.getState());
	}, [rootStore.get.appGroups(), rootStore.get.appGroupKeys()]);

	const deleteItem = () => {};
	const editItem = () => {};
	const selectNewGroup = (key) => {
		console.log("Selecting group: ", key);
		setCurrentKey(key);
		setSelectedGroupKey(key);
	};

	return (
		<Container
			size="lg"
			style={{
				backgroundColor: "#2e2e2e",
			}}
		>
			<Card size="lg" shadow="lg" radius="md" padding="xl" ta="left">
				<Group className={commonCss.cardTitleContainer}>
					<ICON.packages
						style={{ width: rem(50), height: rem(50) }}
						stroke={2}
						color="#238be6"
						className={commonCss.cardTitleIcon}
					/>
					<Text fz="xl" fw={500} className={commonCss.cardTitle} mt="md">
						Groups
					</Text>
				</Group>

				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" py={12}>
					<ErrorBoundary
						fallbackRender={(error) => (
							<FallbackComponent error={error.message} />
						)}
					>
						{rootStore.use.selectedGroupKey() ? (
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
						{rootStore.use.selectedGroupKey() && <GroupDetailView />}
					</ErrorBoundary>
				</SimpleGrid>
			</Card>
		</Container>
	);
};

export default ApplicationGroupView;
