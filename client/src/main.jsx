import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	/** Put your mantine theme override here */
});

/**
 * Renders the main React application with the Mantine theme provider.
 * This is the entry point for the application, and it sets up the initial rendering of the App component.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<App />
		</MantineProvider>
	</React.StrictMode>,
);
