import { useEffect, useState } from "react";
import "./App.css";
import {
	AppShell,
	Button,
	Flex,
	Grid, ActionIcon,
	Card,
	Group,
	Input,
	Modal,
	SimpleGrid,
	Text,
	Textarea,
	rem,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BarSpinner from "components/BarSpinner.jsx";
import { Toaster, toast } from "sonner";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import Tagify from "@yaireo/tagify";
import { nanoid } from "nanoid";
import "@yaireo/tagify/dist/tagify.css";
import { ICON } from "constants/icons";
import classes from "components/MainView.module.css";
import { APP_FORM } from "constants/appForm";
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";
import AppForm from "./components/AppForm";

function App() {
	const BASE_URL = "/api";
	const { formPartOne, formPartTwo } = APP_FORM;

	const [selectedApp, setSelectedApp] = useState(null);

	const useApp = (key) => {
		return useQuery({
			queryKey: ["app"],
			queryFn: async () => fetchApp(key),
		});
	};

	const useAppCollection = () => {
		return useQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/software`);
				return response.data; // Return the actual data from the response
			},
		});
	};

	const useAppKeys = () => {
		return useQuery({
			queryKey: ["appKeys"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/softwareKeys`);
				return response.data; // Return the actual data from the response
			},
		});
	};

	const { data, error, isLoading } = useAppCollection();
	const {
		data: keys,
		error: keysError,
		isLoading: keysIsLoading,
	} = useAppKeys();

	// if (isLoading || keysIsLoading) return <BarSpinner />;
	if (isLoading || keysIsLoading) return <div>Loading...</div>;
	if (error || keysError) {
		if (error) {
			toast.error("Error: ", error.message);
			return <div>Error: {error.message}</div>;
		}
		if (keysError) {
			toast.error("Error: ", keysError.message);
			return <div>Error: {keysError.message}</div>;
		}
	}

	return (
		<AppShell header={{ height: 40 }} padding="md">

			<AppShell.Header withBorder={false}>
				<h1>Chezmoi UI</h1>
				{/* <Header /> */}
				{(isLoading || keysIsLoading) && <BarSpinner />}
			</AppShell.Header>
			<AppShell.Main>
				<Grid columns="2" gutter="10">
					<Grid.Col span="1">
						<Flex
							mih={50}
							bg="rgba(0, 0, 0, .3)"
							gap="md"
							justify="flex-start"
							align="stretch"
							direction="column"
							wrap="wrap"
						>
							<h1>Sandbox</h1>
							{data &&
								keys?.length > 0 &&
								keys.map(
									(key, i) => (i > 4 && i < 25) && <Button key={key}>{data[key]._name}</Button>,
								)}
						</Flex>
					</Grid.Col>
					<Grid.Col span="1">
						{selectedApp && <AppForm app={
							selectedApp = { selectedApp }
							isPopoverOpen={isPopoverOpen}
							closePopover={closePopover}
							selectedApp={selectedApp}
							gotoPrev={gotoPrev}
							gotoNext={gotoNext}
							theme={theme}
							isNewApp={isNewApp} } />}
					</Grid.Col>
				</Grid>

			</AppShell.Main>
			<Toaster
				position="top-right"
				theme="dark"
				expand
				richColors
				closeButton
				pauseWhenPageIsHidden
			/>
		</AppShell>
	);
}

export default App;
