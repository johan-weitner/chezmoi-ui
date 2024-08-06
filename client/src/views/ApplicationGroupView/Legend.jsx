import { Kbd, Text, Title } from "@mantine/core";
import { keyboardShortcuts } from "constants/keyboardShortcuts";
import { nanoid } from "nanoid";
import s from "views/DetailView/DetailView.module.css";
import css from "./GroupView.module.css";

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
		<div id="itemDetailBox" className={css.itemDetailBox}>
			<Title
				fw="normal"
				ta="left"
				mb={30}
				style={{
					backgroundColor: "#252525",
					padding: "10px 20px",
					borderRadius: "10px",
					border: "1px solid #444",
					boxShadow: "10px 10px 30px rgba(0,0,0,0.3)",
				}}
			>
				Legend
			</Title>
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
