import { Text } from "@mantine/core";
import { nanoid } from "nanoid";

const Debugger = (props) => {
	const { selectedApp, isNewApp, resetForm } = props;

	return (
		<>
			<Text
				size="xs"
				style={{
					color: "#666",
					position: "absolute",
					top: "55px",
					right: "15px",
				}}
			>
				selectedApp: {selectedApp ? "true" : "false"} | isNewApp:{" "}
				{isNewApp ? "true" : "false"} | RandomId: {nanoid()}
			</Text>
			<button
				type="button"
				onClick={() => {
					resetForm();
				}}
				style={{
					position: "absolute",
					top: "15px",
					right: "15px",
					zIndex: "999999",
				}}
			>
				Reset
			</button>
		</>
	);
};

export default Debugger;
