import { Badge, Button, Flex, Group, Text, rem } from "@mantine/core";
import { appModelInstallerFields } from "api/appModel";
import { EditedIndicator } from "components/Indicator";
import {
	MarkPopulated,
	MarkUnPopulated,
	WarningSign,
} from "components/Indicator";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { nanoid } from "nanoid";
import { isNullOrEmpty } from "utils/pageUtils";
import classes from "views/MainView/MainView.module.css";
import s from "./DetailView.module.css";
import { useSelector } from "store/store";

const DetailsBox = (props) => {
	const { selectedApp } = props;
	const { editItem, deleteItem } = useClientManager();
	const indicateEdit = selectedApp?.edited ? <EditedIndicator /> : null;
	const selectedAppKey = useSelector((state) => state.root.selectedAppKey);
	const selectedAppTags = useSelector((state) => state.root.selectedAppTags);

	const appHasInstaller = (app) => {
		for (const field of appModelInstallerFields) {
			if (app && !isNullOrEmpty(app[field])) {
				return true;
			}
		}
		return false;
	};

	return (
		<div id="itemDetailBox" className={classes.itemDetailBox}>
			<Flex justify="flex-start" align="flex-start" gap="10">
				<h2 className={s.appTitle}>
					<a
						href={selectedApp?.home || selectedApp?.github || null}
						target="_blank"
						style={{ fontWeight: "normal", textDecoration: "none" }}
						title="Open homepage in new window"
						rel="noreferrer"
					>
						{selectedApp?.name || (
							<Text size="lg">
								<MarkUnPopulated />
								{" Missing Name - "}
								<i style={{ color: "#636363" }}>(Key: "{selectedApp?.key}")</i>
							</Text>
						)}
					</a>
				</h2>
				<div className={s.indicator}>{indicateEdit} </div>
			</Flex>

			{selectedApp.short && (
				<Text size="xl" mb="20">
					{selectedApp.short}
				</Text>
			)}
			{selectedApp.desc && (
				<Text size="lg" mb="20">
					{selectedApp.desc}
				</Text>
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
				{!appHasInstaller(selectedApp) && (
					<Text size="sm" style={{ marginTop: "6px" }}>
						<WarningSign />
					</Text>
				)}
			</div>
			{selectedAppTags && (
				<div style={{ marginTop: "10px" }}>
					Tags:{" "}
					{selectedAppTags?.map((tag) => {
						return (
							<Badge
								key={nanoid()}
								variant="filled"
								color="blue"
								style={{ marginRight: "5px" }}
								size="sm"
							>
								{tag.name}
							</Badge>
						);
					})}
				</div>
			)}

			<Group justify="center" p="md">
				<Button
					onClick={() => editItem(selectedAppKey)}
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
					onClick={() => deleteItem(selectedApp.key)}
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
