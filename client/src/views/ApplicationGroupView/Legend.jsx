import { Kbd, Text } from "@mantine/core";
import { keyboardShortcuts } from "constants/keyboardShortcuts";
import { nanoid } from "nanoid";
import classes from "views/MainView/MainView.module.css";
import s from "views/DetailView/DetailView.module.css";

const Legend = (props) => {
	const keyboardShortcuts = [
		{
			keys: ["OPT", "←"],
			hookString: "opt + left",
			action: "Go to previous group",
		},
		{
			keys: ["OPT", "→"],
			hookString: "opt + right",
			action: "Go to next group",
		},
		{
			keys: ["BACKSPACE"],
			hookString: "backspace",
			action: "Return to group list",
		},
		{
			keys: ["OPT", "W"],
			hookString: "opt + w",
			action: "Return to group list",
		},
	];

	return (
		<div id="itemDetailBox" className={classes.itemDetailBox}>
			<h2
				style={{
					textAlign: "left",
					fontWeight: "normal",
					fontSize: "2em",
					margin: "0 0 10px 0",
				}}
			>
				Legend
			</h2>
			<table className={s.legendTable}>
				<thead>
					<tr>
						<th width="45%">
							<Text size="sm">Keyboard shortcut</Text>
						</th>
						<th>
							<Text size="sm">Action</Text>
						</th>
					</tr>
				</thead>
				<tbody>
					{keyboardShortcuts.map((item) => {
						return (
							<tr key={nanoid()}>
								<td>
									{item.keys.map((char, index) => {
										return (
											<span key={nanoid()}>
												<Kbd>{char}</Kbd>
												{index < item.keys.length - 1 && " + "}
											</span>
										);
									})}
								</td>
								<td>{item.action}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Legend;
