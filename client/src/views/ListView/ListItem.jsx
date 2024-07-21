import { useEffect, useState } from "react";
import { rem, Text } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import { ICON } from "constants/icons";
import { EditedIndicator } from "components/Indicator";
import classes from "views/MainView/MainView.module.css";
import { rootStore } from "store/store";

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
			</div>
		</ErrorBoundary>
	);
};
