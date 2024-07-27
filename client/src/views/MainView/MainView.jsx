import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import Header from "components/Header.jsx";
import DetailView from "views/DetailView/DetailView.jsx";
import ListView from "views/ListView/ListView.jsx";
import classes from "./MainView.module.css";

const MainView = (props) => {
	const theme = useMantineTheme();

	return (
		<>
			<Container
				size="xl"
				className={classes.mainContainer}
				style={{ minHeight: "100% !important" }}
			>
				<Header />
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="sm"
					py={12}
					className={classes.grid}
					style={{ minHeight: "100% !important" }}
				>
					<ListView theme={theme} />
					<DetailView theme={theme} />
				</SimpleGrid>
			</Container>
		</>
	);
};

export default MainView;
