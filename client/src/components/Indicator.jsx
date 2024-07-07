import { Loader, rem } from "@mantine/core";
import { ICON } from "../constants/icons";
import classes from "./MainView/MainView.module.css";

export const FetchIndicator = ({ isFetching, cssClass }) => {
	return (
		isFetching && (
			<div className={cssClass}>
				<Loader color="blue" />;
			</div>
		)
	);
};

export const MutateIndicator = ({ isMutating, cssClass }) => {
	return (
		isMutating && (
			<div className={cssClass}>
				<Loader color="blue" />;
			</div>
		)
	);
};

export const MarkPopulated = () => <span className={classes.green}>✓</span>;
export const MarkUnPopulated = () => <span className={classes.red}>✗</span>;
export const WarningSign = () => (
	<>
		<span className={classes.red}>⚠</span>
		<span className={classes.red}>No installer specified</span>
	</>
);

export const EditedIndicator = () => (
	<ICON.check
		style={{
			width: rem(14),
			height: rem(14),
			position: "absolute",
			right: "75px",
			top: "18px",
		}}
		stroke={2}
		color="green"
		title="Has been edited"
	/>
);
