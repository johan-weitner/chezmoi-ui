import { useState } from "react";
import {
	Container,
	Group,
	SimpleGrid,
	Text,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import Header from "components/Header.jsx";
import DetailView from "views/DetailView/DetailView.jsx";
import ListView from "views/ListView/ListView.jsx";
import classes from "./MainView.module.css";
import ApplicationGroupView from "views/ApplicationGroupView/ApplicationGroupView";
import AppViewMenu from "./AppViewMenu";
import GroupViewMenu from "./GroupViewMenu";
import { ICON } from "constants/icons";
import s from "views/ApplicationGroupView/GroupView.module.css";
import commonCss from "views/ListView/ListView.module.css";

const MainView = (props) => {
	const [showAppGroupView, setShowAppGroupView] = useState(false);
	const theme = useMantineTheme();
	const HeaderIcon = showAppGroupView ? ICON.packages : ICON.box;

	return (
		<>
			<Container
				size="xl"
				className={classes.mainContainer}
				style={{
					minHeight: "100% !important",
				}}
			>
				<Header
					setShowAppGroupView={setShowAppGroupView}
					data-testid="main-header"
				/>
				<Group className={s.groupListHeader} data-testid="view-header">
					<HeaderIcon
						style={{ width: rem(50), height: rem(50) }}
						stroke={2}
						color="#238be6"
						className={commonCss.cardTitleIcon}
					/>
					<Text
						fz="xl"
						fw={500}
						className={s.mainTitle}
						mt="md"
						data-testid="view-header-text"
					>
						{showAppGroupView ? "Groups" : "Applications"}
					</Text>
					{showAppGroupView ? <GroupViewMenu /> : <AppViewMenu />}
				</Group>
				{showAppGroupView ? (
					<ApplicationGroupView />
				) : (
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" py={12}>
						<ListView theme={theme} />
						<DetailView theme={theme} />
					</SimpleGrid>
				)}
			</Container>
		</>
	);
};

export default MainView;
