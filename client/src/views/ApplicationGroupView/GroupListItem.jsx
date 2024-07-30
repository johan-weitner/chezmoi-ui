import { Text, rem } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { EditedIndicator } from "components/Indicator";
import { ICON } from "constants/icons";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { rootStore } from "store/store";
import classes from "../ListView/ListView.module.css";

const GroupListItem = (props) => {
	const { selectedGroupKey, setSelectedGroupKey, group, deleteItem, editItem } =
		props;
	// const selectedKey = rootStore.get.selectedAppKey();
	// const [currentKey, setCurrentKey] = useState(selectedKey);

	const className =
		selectedGroupKey && selectedGroupKey === group ? classes.selected : null;
	const indicateEdit = group?.edited ? <EditedIndicator /> : null;

	// const selectNewApp = () => {
	// 	setCurrentKey(app.key);
	// 	rootStore.set.selectedAppKey(app.key);
	// };

	/*
						<ListItem
							selectedGroupKey={currentKey}
							setSelectedGroupKey={selectNewGroup}
							group={rootStore.use.appGroups()[item]}
							key={nanoid()}
							deleteItem={() => {}}
							editItem={() => {}}
						/>
	*/

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
					onClick={() => setSelectedGroupKey(group)}
					style={{ width: "100%" }}
					type="button"
				>
					{group}
				</button>
				{/* <ICON.edit
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
					onClick={() => editItem(group.key, true)}
				/> */}
				{indicateEdit}
			</div>
		</ErrorBoundary>
	);
};

export default GroupListItem;
