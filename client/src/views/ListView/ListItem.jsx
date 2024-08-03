import { Text, rem } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { EditedIndicator } from "components/Indicator";
import { ICON } from "constants/icons";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import classes from "./ListView.module.css";
import { MAIN_VIEWS, getState } from "store/store";
import { useGroupManager } from "core/GroupManager";
import { useSelector, useDispatch } from "react-redux";

export const ListItem = (props) => {
	const dispatch = useDispatch();
	const {
		selectedAppKey,
		setSelectedAppKey,
		app,
		deleteItem,
		editItem,
		mainView,
	} = props;
	const [isGroupMode, setIsGroupMode] = useState(mainView);
	const [appKey, setAppKey] = useState(selectedAppKey);
	const indicateEdit = app?.edited ? <EditedIndicator /> : null;
	const { putAppInGroup } = useGroupManager();

	useEffect(() => {
		setIsGroupMode(mainView === MAIN_VIEWS[1]);
	}, [mainView]);

	const selectApp = (key) => {
		if (mainView === MAIN_VIEWS[0]) {
			setSelectedAppKey(key);
		} else if (mainView === MAIN_VIEWS[1]) {
			putAppInGroup(key);
		}
	};

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<div
				style={{ position: "relative", width: "100%" }}
				className={selectedAppKey === app.key ? classes.selected : null}
			>
				{isGroupMode ? (
					<button
						className={classes.itemBox}
						onClick={() =>
							putAppInGroup(
								useSelector((state) => state.root.selectedGroupId),
								app?.id,
							)
						}
						style={{ width: "100%" }}
						type="button"
					>
						{app?.name || (
							<Text size="sm" style={{ color: "#333 !important" }}>
								<i>[ Missing Name ]</i> - ({app?.key})
							</Text>
						)}
					</button>
				) : (
					<button
						className={app?.done ? classes.itemBoxGrey : classes.itemBox}
						onClick={() => selectApp(app?.key)}
						style={{ width: "100%" }}
						type="button"
					>
						{app?.name || (
							<Text size="sm" style={{ color: "#333 !important" }}>
								<i>[ Missing Name ]</i> - ({app?.key})
							</Text>
						)}{" "}
					</button>
				)}
				{mainView === MAIN_VIEWS[0] && (
					<div style={app?.done ? { display: "none" } : { display: "block" }}>
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
				)}
				{mainView === MAIN_VIEWS[1] && (
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
							color="#393"
						/>
					</>
				)}
			</div>
		</ErrorBoundary>
	);
};
