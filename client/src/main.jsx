import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClientContext } from "core/ClientContext.jsx";
import { useClient, ClientProvider } from "core/ClientProvider.jsx";
import App2 from "./App2.jsx";

// console.log("ClientContext", ClientContext);
// console.log("ClientContext._ctx", ClientContext._ctx);

const theme = createTheme({
	/** Mantine theme override goes here */
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme} forceColorScheme="dark">
				{/* <ClientContext.Provider>
					<App />
				</ClientContext.Provider> */}
				<ClientProvider>
					<App2 />
				</ClientProvider>
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
);
