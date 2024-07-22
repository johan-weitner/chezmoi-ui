import "utils/wdyr";
import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { printTitleCard } from "utils/titleCard.js";
import { Toaster } from "sonner";
import MainView from "views/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";
import "./App.css";

const theme = createTheme({});
printTitleCard();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<MantineProvider theme={theme} forceColorScheme="dark">
			<MainView />
			<Toaster
				position="top-right"
				theme="dark"
				expand
				richColors
				closeButton
				pauseWhenPageIsHidden
			/>
		</MantineProvider>
	</React.StrictMode>,
);
