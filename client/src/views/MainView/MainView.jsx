import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import DetailView from "views/DetailView/DetailView.jsx";
import ListView from "views/ListView/ListView.jsx";
import Header from "components/Header.jsx";
import classes from "./MainView.module.css";
import "@yaireo/tagify/dist/tagify.css";
import { useStore } from "store/store";

const MainView = (props) => {
	const theme = useMantineTheme();
	const debug = { content: "not impl" };

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
					{/* <DetailView theme={theme} /> */}
				</SimpleGrid>
				<div
					style={{
						backgroundColor: "#eee",
						color: "#000",
						textAlign: "left",
						height: "800px",
						overflowY: "scroll",
						position: "fixed",
						top: "1200px",
						left: "0",
						zIndex: "999999",
					}}
				>
					<pre>{JSON.stringify(debug, null, 2)}</pre>
				</div>
			</Container>
		</>
	);
};

export default MainView;
