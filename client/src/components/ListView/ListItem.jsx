import { rem } from "@mantine/core";
import { useAppCollection } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import { useLoadingMutation } from "../../api/appCollectionApi";
import { ICON } from "../../constants/icons";
import { EditedIndicator } from "../Indicator";
import classes from "../MainView/MainView.module.css";

export const ListItem = (props) => {
	const { selectApp, app, selectedAppKey } = props;
	const { data: software } = useAppCollection();
	const className =
		selectedAppKey && selectedAppKey === app.key ? classes.selected : null;
	const indicateEdit = software[app]?.edited ? <EditedIndicator /> : null;

	const editItem = () => {};
	const deleteItem = () => {};
	const openApp = (key) => {
		selectApp(key);
	};

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
					onClick={() => selectApp(app.key)}
					style={{ width: "100%" }}
					type="button"
				>
					{app?._name}
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
