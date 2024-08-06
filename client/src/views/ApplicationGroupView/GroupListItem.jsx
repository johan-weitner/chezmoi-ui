import FallbackComponent from "components/FallbackComponent";
import { EditedIndicator } from "components/Indicator";
import { ErrorBoundary } from "react-error-boundary";
import classes from "../ListView/ListView.module.css";

const GroupListItem = (props) => {
	const { selectedGroupKey, setSelectedGroupKey, group, deleteItem, editItem } =
		props;

	const className =
		selectedGroupKey && selectedGroupKey === group ? classes.selected : null;
	const indicateEdit = group?.edited ? <EditedIndicator /> : null;

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
					{group.name}
				</button>
				{indicateEdit}
			</div>
		</ErrorBoundary>
	);
};

export default GroupListItem;
