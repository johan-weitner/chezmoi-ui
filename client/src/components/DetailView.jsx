import {
	ActionIcon,
	Button,
	Card,
	Badge,
	Group,
	Text,
	rem,

} from "@mantine/core";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { ICON } from "../constants/icons";
import classes from "./MainView.module.css";
import { APP_FORM } from 'constants/appForm.js'

const markPopulated = <span className={classes.green}>✓</span>;
const markUnPopulated = <span className={classes.red}>✗</span>;
const warningSign = <span className={classes.red}>⚠</span>;

/**
 * Renders a detailed view of a selected application, including its name, short description, full description, and links to its homepage, documentation, and GitHub repository. The view also includes buttons to edit or delete the selected application.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.selectedApp - The selected application object.
 * @param {Function} props.deleteItem - A function to delete the selected application.
 * @param {Function} props.editItem - A function to edit the selected application.
 * @param {Object} props.theme - The current theme object.
 * @param {Function} props.gotoPrev - A function to navigate to the previous application.
 * @param {Function} props.gotoNext - A function to navigate to the next application.
 * @returns {JSX.Element} - The DetailView component.
 */
const DetailView = (props) => {
	const { selectedApp, deleteItem, editItem, theme, gotoPrev, gotoNext } =
		props;
	const tags = [];  // selectedApp?.tags && JSON.parse(selectedApp.tags);
	let hasInstaller = false;
	APP_FORM.formPartTwo.map((item) => {
		if (selectedApp[item.name] && selectedApp[item.name].length > 0) {
			hasInstaller = true;
			return;
		}
	});

	console.log("Tags: ", tags);
	console.log("Typeof Tags: ", typeof tags);

	return (
		<Card shadow="md" radius="md" className={classes.card} padding="xl">
			<ICON.detail
				style={{ width: rem(50), height: rem(50) }}
				stroke={2}
				color={theme.colors.blue[6]}
			/>
			<Text
				fz="lg"
				fw={500}
				className={classes.cardTitle}
				mt="md"
				style={{ textAlign: "left" }}
			>
				Detail view
			</Text>
			<ActionIcon
				size={32}
				radius="xl"
				color={theme.primaryColor}
				variant="filled"
				title="Go to previous app"
				onClick={() => gotoPrev()}
				style={{
					position: "absolute",
					right: "90px",
					top: "130px",
					zIndex: "10",
				}}
			>
				<IconPlayerTrackPrev
					style={{ width: rem(18), height: rem(18) }}
					stroke={1.5}
					color="white"
				/>
			</ActionIcon>
			<ActionIcon
				size={32}
				radius="xl"
				color={theme.primaryColor}
				variant="filled"
				title="Go to next app"
				onClick={() => gotoNext()}
				style={{
					position: "absolute",
					right: "50px",
					top: "130px",
					zIndex: "10",
				}}
			>
				<IconPlayerTrackNext
					style={{ width: rem(18), height: rem(18) }}
					stroke={1.5}
					color="white"
				/>
			</ActionIcon>
			<Card
				shadow="md"
				fz="sm"
				c="dimmed"
				mt="sm"
				style={{ textAlign: "left" }}
			>
				{selectedApp && (
					<div className={classes.itemBox}>
						<h2
							style={{
								textAlign: "left",
								fontWeight: "normal",
								fontSize: "2em",
								margin: "0 0 10px 0",
							}}
						>
							<a
								href={selectedApp._home || selectedApp._github || null}
								target="_blank"
								style={{ fontWeight: "normal", textDecoration: "none" }}
								title="Open homepage in new window"
								rel="noreferrer"
							>
								{selectedApp._name || selectedApp._bin}
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
						</h2>

						{selectedApp._short && (
							<Text className={classes.short}>{selectedApp._short}</Text>
						)}
						{selectedApp._desc && (
							<Text className={classes.desc}>{selectedApp._desc}</Text>
						)}

						<div className={classes.indicatorGroup}>
							<Text size="sm">
								{selectedApp._home ? markPopulated : markUnPopulated} Homepage
							</Text>
							<Text size="sm">
								{selectedApp._docs ? markPopulated : markUnPopulated}{" "}
								Documentation
							</Text>
							<Text size="sm">
								{selectedApp._github ? markPopulated : markUnPopulated} Github
							</Text>
							{!hasInstaller && (
								<Text size="sm" style={{ marginTop: "6px" }}>
									{warningSign} <span className={classes.red} >No installer specified</span>
								</Text>
							)}
						</div>
						{tags && (
							<div>
								{tags?.map(tag => {
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
									)
								})}
							</div>
						)}


						<Group justify="center" p="md">
							<Button
								onClick={() => editItem(selectedApp.key)}
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
								onClick={() => deleteItem()}
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
				)}
			</Card>
		</Card>
	);
};

export default DetailView;
