import { useRef, useState } from "react";
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
	useMantineTheme
} from "@mantine/core";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import EditView from "./components/EditView/EditView";
import { getApp } from "api/appCollectionApi";

function App() {
	const BASE_URL = "/api";
	const theme = useMantineTheme();
	const { formPartOne, formPartTwo } = APP_FORM;
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedApp, setSelectedApp] = useState(null);
	const modalRef = useRef();

	const useAppCollection = () => {
		return useQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/software`);
				return response.data;
			},
		});
	};

	const useAppKeys = () => {
		return useQuery({
			queryKey: ["appKeys"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/softwareKeys`);
				return response.data;
			},
		});
	};

	const useApp = (key) => {
		return useQuery({
			queryKey: ["app"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/getApp?key=${key}`);
				return response.data;
			},
		});
	};

	// const queryClient = new QueryClient();
	// const getApp = async (key) => {
	// 	const data = await queryClient.fetchQuery({
	// 		queryKey: ["app"],
	// 		queryFn: async () => {
	// 			const response = await axios.get(`${BASE_URL}/getApp?key=${key}`)
	// 				.then(response => {
	// 					console.log('Success');;
	// 					return response;
	// 				})
	// 				.catch(error => {
	// 					console.lerror(error.message);
	// 					toast.lerror(error.message);
	// 				});
	// 			return response?.data;
	// 		},
	// 	});
	// 	return data;
	// };

	const openApp = async key => {
		const app = await getApp(key);
		// console.log("Open app:", app);
		setSelectedApp(app);
		setIsPopoverOpen(true);
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
									(key, i) => (i > 4 && i < 25) &&
										<Button onClick={() => openApp(key)} key={key}>{data[key]?._name}</Button>,
								)}
						</Flex>
					</Grid.Col>
					<Grid.Col span="1">
						{selectedApp && isPopoverOpen && (
							<EditView
								isPopoverOpen={isPopoverOpen || false}
								closePopover={() => setIsPopoverOpen(false)}
								selectedApp={selectedApp}
								gotoPrev={() => { }}
								gotoNext={() => { }}
								theme={theme}
								isNewApp={false}
								ref={modalRef}
							/>
						)
						}
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
