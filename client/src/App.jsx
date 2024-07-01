import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Toaster, toast } from "sonner";
import MainView from "./components/MainView";
import Header from "./components/Header";

function App() {
	const [software, setSoftware] = useState(null);
	const [opened, { toggle }] = useDisclosure();

	useEffect(() => {
		seedAppList();
	}, []);

	const saveList = (list) => {
		setSoftware(list);
		// saveDocument();
	};

	const seedAppList = () => {
		axios
			.get("http://localhost:3000/software")
			.then((response) => {
				const { data } = response;
				const keys = Object.keys(data);
				keys.map((key) => {
					data[key].key = key;
				});

				saveList(data);
				console.log("Seeded software: ", data);
				toast.success("List was successfully seeded");
			})
			.catch((error) => {
				console.error(error);
				toast.error(error);
			});
	};

	const deleteApp = (key) => {
		const appName = software[key]?._name;
		delete software[key];
		saveList({ ...software });
		toast.success(`${appName} was deleted`);
	};

	const saveDocument = () => {
		if (software === null || Object.keys(software).length === 0) {
			toast.error("Critical error - no software list to save");
			return;
		}
		axios
			.post("http://localhost:3000/save", {
				...software,
			})
			.then((response) => {
				const { data } = response;
				setSoftware((prevState) => ({
					...JSON.parse(data),
				}));
				toast.success("Saved current state to disk");
			})
			.catch((error) => {
				console.error(error);
				toast.error(error);
			});
	};

	const startOver = () => {
		localStorage.removeItem("APP_LIST");
		seedAppList();
		toast.success("Started over and seeded list from source file");
	};

	const updateItem = (item) => {
		setSoftware((prevState) => ({
			...prevState,
			[item.key]: item,
		}));
		toast.success("Item was updated");
	};

	return (
		<AppShell
			header={{ height: 40 }}
			padding="md"
		>
			<AppShell.Header withBorder={false}>
				<Header />
			</AppShell.Header>

			<AppShell.Main>
				{software && (
					<MainView
						software={software}
						deleteApp={deleteApp}
						save={saveDocument}
						startOver={startOver}
						updateItem={updateItem}
					/>
				)}
			</AppShell.Main>
			<Toaster theme="dark" richColors closeButton pauseWhenPageIsHidden />
		</AppShell>
	);
}

export default App;
