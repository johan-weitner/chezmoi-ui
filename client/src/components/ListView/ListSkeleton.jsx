import { rem } from "@mantine/core";
import { useAppCollection } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import { useLoadingMutation } from "../../api/appCollectionApi";
import { ICON } from "../../constants/icons";
import { EditedIndicator } from "../Indicator";
import classes from "../MainView/MainView.module.css";

export const ListSkeleton = (props) => {
	return (
		<>
			<div style={{ position: "relative", width: "100%" }} key={"k_$(i)"}>
				<button
					className={classes.itemBox}
					style={{ width: "100%" }}
					type="button"
				>
					...
				</button>
			</div>
		</>
	);
};

export default ListSkeleton;
