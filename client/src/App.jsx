import { Toaster } from "sonner";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";
import "./App.css";
/**
 * DEPRECATED: Mount MainView and Toastr directly in main.jsx
 */
function App() {
	return (
		<>
			{/* <AppShell header={{ height: 0 }}> */}
			{/* <AppShell.Header withBorder={false}>
					<Center size="xl" px={0} py={0} m={0} style={{ border: "1px solid #393" }}>
						<Header />
					</Center>
				</AppShell.Header> */}
			{/* <AppShell.Main className="appShellMain"> */}
			<MainView />
			{/* </AppShell.Main> */}
			<Toaster
				position="top-right"
				theme="dark"
				expand
				richColors
				closeButton
				pauseWhenPageIsHidden
			/>
			{/* </AppShell> */}
		</>
	);
}

export default App;
