import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import AppForm from "./AppForm.jsx";
import DetailView from "./DetailView";
import classes from "./FeatureCards.module.css";
import FeatureHeader from "./FeatureHeader";
import MergedView from "./MergedView";

const FeaturesCards = (props) => {
	const { merged, deleteApp, save, startOver, updateItem } = props;
	const theme = useMantineTheme();
	const [selectedApp, setSelectedApp] = useState(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	useHotkeys("esc", () => setIsPopoverOpen(false));
	const modalRef = useRef();

	const selectApp = (e, item) => {
		e.preventDefault();
		setSelectedApp(merged[item]);
	};

	const deleteItem = (key) => {
		setSelectedApp(null);
		deleteApp(selectedApp.key);
	};

	const editItem = () => {
		setIsPopoverOpen(true);
	};

	const updateApp = (updatedApp) => {
		updateItem(updatedApp);
		setIsPopoverOpen(false);
	};

	const overlayClass = isPopoverOpen ? classes.overlay : classes.hidden;

	return (
		<>
			<Container
				size="lg"
				py="xl"
				style={{ backgroundColor: "#333", paddingTop: "0px" }}
			>
				<FeatureHeader
					save={save}
					startOver={startOver}
					style={{ borderRadius: "10px" }}
				/>
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="sm"
					mt={50}
					className={classes.grid}
					style={{ backgroundColor: "#333" }}
				>
					{merged && (
						<MergedView
							merged={merged}
							theme={theme}
							selectApp={selectApp}
							deleteItem={deleteApp}
							editItem={editItem}
						/>
					)}
					{selectedApp && (
						<DetailView
							selectedApp={selectedApp}
							theme={theme}
							deleteItem={deleteItem}
							editItem={editItem}
						/>
					)}
				</SimpleGrid>
				{selectedApp && isPopoverOpen && (
					<>
						<AppForm
							ref={modalRef}
							isPopoverOpen={isPopoverOpen}
							setIsPopoverOpen={setIsPopoverOpen}
							updateApp={updateApp}
							selectedApp={selectedApp}
						/>
						<div className={overlayClass} />
					</>
				)}
			</Container>
		</>
	);
};

export default FeaturesCards;
