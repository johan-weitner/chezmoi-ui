import { Kbd, Text } from "@mantine/core";
import classes from "views/MainView/MainView.module.css";
import { keyboardShortcuts } from "constants/keyboardShortcuts";
import { nanoid } from "nanoid";
import s from "./DetailView.module.css";

const Legend = (props) => {
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
