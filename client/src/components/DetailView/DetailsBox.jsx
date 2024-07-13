import { Badge, Button, Group, Text, rem } from "@mantine/core";
import { ICON } from "../../constants/icons";
import { MarkPopulated, MarkUnPopulated, WarningSign } from "../Indicator";
import classes from "../MainView/MainView.module.css";

const DetailsBox = (props) => {
	const { selectedApp, tags, hasInstaller, indicateEdit, edit, removeApp } =
		props;

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
				<a
					href={selectedApp.home || selectedApp.github || null}
					target="_blank"
					style={{ fontWeight: "normal", textDecoration: "none" }}
					title="Open homepage in new window"
					rel="noreferrer"
				>
					{selectedApp.name || selectedApp.bin}
					{/* <ActionIcon
									size={32}
									radius="xl"
									color="transparent"
									style={{ position: "relative", top: "3px", left: "10px" }}
								>
									<IconFolderOpen
										style={{ width: rem(30), height: rem(30) }}
										stroke={2.5}
										color="blue"
									/>
								</ActionIcon> */}
				</a>
				{indicateEdit}
			</h2>

			{selectedApp.short && (
				<Text className={classes.short}>{selectedApp.short}</Text>
			)}
			{selectedApp.desc && (
				<Text className={classes.desc}>{selectedApp.desc}</Text>
			)}

			<div className={classes.indicatorGroup}>
				<Text size="sm">
					{selectedApp.home ? <MarkPopulated /> : <MarkUnPopulated />} Homepage
				</Text>
				<Text size="sm">
					{selectedApp.docs ? <MarkPopulated /> : <MarkUnPopulated />}{" "}
					Documentation
				</Text>
				<Text size="sm">
					{selectedApp.github ? <MarkPopulated /> : <MarkUnPopulated />} Github
				</Text>
				{!hasInstaller && (
					<Text size="sm" style={{ marginTop: "6px" }}>
						<WarningSign />
					</Text>
				)}
			</div>
			{tags && (
				<div>
					{tags?.map((tag) => {
						return (
							<Badge
								key={tag?.value}
								variant="filled"
								color="blue"
								style={{ marginRight: "5px" }}
								size="sm"
							>
								{tag?.value}
							</Badge>
						);
					})}
				</div>
			)}

			<Group justify="center" p="md">
				<Button
					onClick={() => edit(selectedApp.key)}
					className={classes.editBtn}
					leftSection={
						<ICON.edit
							style={{
								width: rem(20),
								height: rem(20),
								marginRight: "10px",
							}}
							stroke={2}
							color="#FFF"
						/>
					}
				>
					Edit
				</Button>
				<Button
					onClick={() => removeApp(selectedApp.key)}
					className={classes.deleteBtn}
					leftSection={
						<ICON.remove
							style={{
								width: rem(20),
								height: rem(20),
								margin: "0 10px 0 0px",
							}}
							stroke={2}
							color="#FFF"
						/>
					}
				>
					Delete
				</Button>
			</Group>
		</div>
	);
};

export default DetailsBox;
