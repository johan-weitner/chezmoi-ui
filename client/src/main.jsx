import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClientProvider } from "core/ClientProvider.jsx";
import { Toaster } from "sonner";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";
import "./App.css";

const theme = createTheme({
	/** Mantine theme override goes here */
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme} forceColorScheme="dark">
				<ClientProvider>
					<MainView />
					<Toaster
						position="top-right"
						theme="dark"
						expand
						richColors
						closeButton
						pauseWhenPageIsHidden
					/>
					<p>OK</p>
				</ClientProvider>
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);
