import { rem, Text } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import { ICON } from "constants/icons";
import { EditedIndicator } from "components/Indicator";
import classes from "views/MainView/MainView.module.css";

export const ListItem = (props) => {
	const { selectedAppKey, setSelectedAppKey, app, deleteItem, editItem } =
		props;
	const className =
		selectedAppKey && selectedAppKey === app.key ? classes.selected : null;
	const indicateEdit = app?.edited ? <EditedIndicator /> : null;

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
					onClick={() => setSelectedAppKey(app.key)}
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