import "./App.css";
import { AppShell } from "@mantine/core";
import { Toaster } from "sonner";
import Header from "./components/Header";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";

function App() {
	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header withBorder={false} style={{ position: "relative" }}>
				<Header />
			</AppShell.Header>
			<AppShell.Main style={{ paddingTop: "0" }}>
				<MainView />
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
