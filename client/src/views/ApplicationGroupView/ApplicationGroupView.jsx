import { useState, useEffect } from "react";
import { Container, Group, Card, Title, Text, SimpleGrid } from "@mantine/core";
import { rootStore } from "store/store";
import { nanoid } from "nanoid";
import "../../common.css";
import GroupList from "./GroupList";
import GroupDetailView from "./GroupDetailView";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";

const ApplicationGroupView = (props) => {
	const [groups, setGroups] = useState(null);
	const [groupKeys, setGroupKeys] = useState(null);
	useEffect(() => {
		setGroups(rootStore.get.appGroups());
		setGroupKeys(rootStore.get.appGroupKeys());
		console.log("groups", JSON.stringify(groups, null, 2));
	}, [rootStore.get.appGroups(), rootStore.get.appGroupKeys()]);

	const deleteItem = () => {};
	const editItem = () => {};

	return (
		<Container
			size="lg"
			style={{
				backgroundColor: "#2e2e2e",
			}}
		>
			<Card size="lg" shadow="lg" radius="md" padding="xl" ta="left">
				<Group>
					<Title fw="normal">Application Groups</Title>
					<Text size="sm" mb="-16" style={{ color: "#999" }}>
						({rootStore.use.appGroupKeys()?.length} groups in total)
					</Text>
				</Group>

				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" py={12}>
					<ErrorBoundary
						fallbackRender={(error) => (
							<FallbackComponent error={error.message} />
						)}
					>
						<GroupList deleteItem={deleteItem} editItem={editItem} />
					</ErrorBoundary>
					<ErrorBoundary
						fallbackRender={(error) => (
							<FallbackComponent error={error.message} />
						)}
					>
						{rootStore.use.selectedGroupKey() && <GroupDetailView />}
					</ErrorBoundary>
				</SimpleGrid>
				<div style={{ height: "1000px" }}>skjfdjfsdfk</div>
			</Card>
		</Container>
	);
};

export default ApplicationGroupView;
