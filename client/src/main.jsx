import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clientCtx from "core/clientContext.js";
export const AppContext = createContext(null);

const { actions } = clientCtx;
console.log(clientCtx);
actions?.test();

const theme = createTheme({
	/** Mantine theme override goes here */
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme} forceColorScheme="dark">
				<AppContext.Provider value={{ ...clientCtx }}>
					<App />
				</AppContext.Provider>
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);
