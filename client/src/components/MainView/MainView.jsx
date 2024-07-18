import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import DetailView from "components/DetailView/DetailView.jsx";
import ListView from "components/ListView/ListView.jsx";
import Header from "../Header.jsx";
import classes from "./MainView.module.css";
import "@yaireo/tagify/dist/tagify.css";
import { useStore } from "store/rootState";

const MainView = (props) => {
	const theme = useMantineTheme();
	const {
		allApps,
		setAllApps,
		totalCount,
		setTotalCount,
		limit,
		setLimit,
		downloadGenericYaml,
		downloadGenericJson,
		downloadInstallDoctorYaml,
		// selectedApp: { id, key, name, desc, home, edited, hasInstaller },
		selectedApp,
		setSelectedApp,
		selectedAppKey,
		setSelectedAppKey,
		closeApp,
		editApp,
		addItem,
		isEditMode: editMode,
		setIsEditeMode: setEditMode,
		page,
		pageCount,
		pageContent,
		setPage,
		setPageCount,
		setPageContent,
		filterModel,
		filteredResult,
		activeFilter,
		isLoading,
		setIsLoading,
		error,
		setError,
	} = useStore();

	const currentApp = selectedApp
		? { ...selectedApp }
		: { id: 0, key: 0, name: 0, desc: 0, home: 0, edited: 0, hasInstaller: 0 };
	const allAppsLength = allApps ? allApps.length : 0;
	const pageCountLength = pageCount ? pageCount.length : 0;

	const debug = {
		isLoading,
		allAppsLength,
		totalCount,
		limit,
		selectedAppKey,
		editMode,
		page,
		pageCount,
		pageCountLength,

		filteredResult,
		activeFilter,

		filterModel: Object.keys(filterModel).length,
		currentApp,
	};

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
