import "./App.css";
import { AppShell } from "@mantine/core";
import { Toaster } from "sonner";
import Header from "./components/Header";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";

function App() {
	return (
		<AppShell header={{ height: 60 }}>
			<AppShell.Header withBorder={false} className="appShellHeader" style={{}}>
				<Header />
			</AppShell.Header>
			<AppShell.Main className="appShellMain">
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
