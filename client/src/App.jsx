import "./App.css";
import { Toaster } from "sonner";
import Header from "./components/Header";
import MainView from "./components/MainView/MainView";
import {
	AppShell
} from "@mantine/core";
import "@yaireo/tagify/dist/tagify.css";

function App() {
	return (
		<AppShell header={{ height: 40 }} padding="md">
			<AppShell.Header withBorder={false}>
				<Header />
			</AppShell.Header>
			<AppShell.Main>
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
