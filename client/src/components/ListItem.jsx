import { rem } from "@mantine/core";
import { useAppCollection } from "api/appCollectionApi";
import { ICON } from "../constants/icons";
import { EditedIndicator } from "./Indicator";
import classes from "./MainView.module.css";

/**
 * Renders a list item component that displays software information and provides actions to select, edit, and delete the item.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.software - An object containing software information.
 * @param {Function} props.selectApp - A function to handle selecting the app.
 * @param {Function} props.editItem - A function to handle editing the item.
 * @param {Function} props.deleteItem - A function to handle deleting the item.
 * @param {string} props.item - The identifier of the item.
 * @returns {JSX.Element} The rendered list item component.
 */
export const ListItem = (props) => {
	const { selectApp, appKey, editItem, deleteItem, app } = props;
	const { data: software } = useAppCollection();
	const className = appKey?.key === app ? classes.selected : null;
	const indicateEdit = software[app]?.edited ? <EditedIndicator /> : null;

	return (
		<div style={{ position: "relative", width: "100%" }} className={className}>
			<button
				className={classes.itemBox}
				onClick={() => selectApp(appKey)}
				style={{ width: "100%" }}
				type="button"
			>
				{software[app]?._name}
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
	);
};
