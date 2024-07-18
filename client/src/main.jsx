import "utils/wdyr";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { printTitleCard } from "utils/titleCard.js";
// import { ClientProvider } from "core/ClientProvider.jsx";
import { Toaster } from "sonner";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";
import "./App.css";

const theme = createTheme({
	/** Mantine theme override goes here */
});

const queryClient = new QueryClient();
printTitleCard();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme} forceColorScheme="dark">
				{/* <ClientProvider> */}
				<MainView />
				<Toaster
					position="top-right"
					theme="dark"
					expand
					richColors
					closeButton
					pauseWhenPageIsHidden
				/>

				{/* </ClientProvider> */}
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);
