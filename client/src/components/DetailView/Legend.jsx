import { Kbd, Text } from "@mantine/core";
import classes from "components/MainView/MainView.module.css";
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
						<th width="50%">
							<Text size="sm">Keyboard shortcut</Text>
						</th>
						<th>
							<Text size="sm">Action</Text>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<Kbd>OPT</Kbd> + <Kbd>N</Kbd>
						</td>
						<td>Add a new application</td>
					</tr>
					<tr>
						<td>
							<Kbd>OPT</Kbd> + <Kbd>N</Kbd>
						</td>
						<td>Add a new application</td>
					</tr>
					<tr>
						<td>
							<Kbd>OPT</Kbd> + <Kbd>N</Kbd>
						</td>
						<td>Add a new application</td>
					</tr>
					<tr>
						<td>
							<Kbd>OPT</Kbd> + <Kbd>N</Kbd>
						</td>
						<td>Add a new application</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Legend;
