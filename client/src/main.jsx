import "utils/wdyr";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "store/store";
import { Provider } from "react-redux";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Toaster } from "sonner";
import { printTitleCard } from "utils/titleCard.js";
import MainView from "views/MainView/MainView";
import "./App.css";

const theme = createTheme({});
printTitleCard();
MainView.whyDidYouRender = true;

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
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
		</Provider>
	</React.StrictMode>,
);
