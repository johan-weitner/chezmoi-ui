import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import FeatureCards from "./components/FeatureCards";
import Header from "./components/Header";

function App() {
	const [software, setSoftware] = useState(null);

	useEffect(() => {
		// if (localStorage.getItem("APP_LIST")) {
		// 	setSoftware(JSON.parse(localStorage.getItem("APP_LIST")));
		// } else {
		// 	seedAppList();
		// }
		seedAppList();
	}, []);

	const saveList = (list) => {
		localStorage.setItem("APP_LIST", JSON.stringify(list));
		setSoftware(list);
	};

	const seedAppList = () => {
		axios
			.get("http://localhost:3000/software")
			.then((response) => {
				// const {
				// 	data: { softwarePackages },
				// } = response;
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

	const saveNewDocument = () => {
		axios
			.post("http://localhost:3000/save", {
				...software,
			})
			.then(() => {
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
		<>
			<Header />
			{software && (
				<FeatureCards
					software={software}
					deleteApp={deleteApp}
					save={saveNewDocument}
					startOver={startOver}
					updateItem={updateItem}
				/>
			)}
			<Toaster theme="dark" richColors closeButton pauseWhenPageIsHidden />
		</>
	);
}

export default App;
