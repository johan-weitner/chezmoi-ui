import { Text, rem } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { EditedIndicator } from "components/Indicator";
import { ICON } from "constants/icons";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { rootStore } from "store/store";
import classes from "./ListView.module.css";
import { MAIN_VIEWS } from "store/store";

export const ListItem = (props) => {
	const { selectedAppKey, setSelectedAppKey, app, deleteItem, editItem } =
		props;
	// const selectedKey = rootStore.get.selectedAppKey();
	// const [currentKey, setCurrentKey] = useState(selectedKey);

	const className =
		selectedAppKey && selectedAppKey === app.key ? classes.selected : null;
	const indicateEdit = app?.edited ? <EditedIndicator /> : null;

	// useEffect(() => {
	// 	setCurrentKey(rootStore.get.selectedAppKey());
	// }, [rootStore.use.selectedAppKey()]);

	// const selectNewApp = () => {
	// 	setCurrentKey(app.key);
	// 	rootStore.set.selectedAppKey(app.key);
	// };

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<div
				style={{ position: "relative", width: "100%" }}
				className={className}
			>
				<button
					className={classes.itemBox}
					onClick={() => setSelectedAppKey(app?.key)}
					style={{ width: "100%" }}
					type="button"
				>
					{app?.name || (
						<Text size="sm" style={{ color: "#333 !important" }}>
							<i>[ Missing Name ]</i> - ({app?.key})
						</Text>
					)}
				</button>
				{rootStore.use.mainView() === MAIN_VIEWS[0] && (
					<>
						<ICON.edit
							style={{
								width: rem(20),
								height: rem(20),
								position: "absolute",
								right: "45px",
								top: "14px",
								cursor: "pointer",
							}}
							stroke={2}
							color="white"
							onClick={() => editItem(app.key, true)}
						/>
						<ICON.remove
							style={{
								width: rem(20),
								height: rem(20),
								position: "absolute",
								right: "15px",
								top: "14px",
								cursor: "pointer",
							}}
							stroke={2}
							color="white"
							onClick={() => deleteItem(app.key)}
						/>
						{indicateEdit}
					</>
				)}
				{rootStore.use.mainView() === MAIN_VIEWS[1] && (
					<>
						<ICON.arrowRight
							style={{
								width: rem(20),
								height: rem(20),
								position: "absolute",
								right: "15px",
								top: "14px",
								cursor: "pointer",
							}}
							stroke={2}
							color="white"
							onClick={() => editItem(app.key, true)}
						/>
					</>
				)}
			</div>
		</ErrorBoundary>
	);
};
