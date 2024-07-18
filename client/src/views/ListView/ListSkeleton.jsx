import classes from "views/MainView/MainView.module.css";

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
