import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Group,
	Text,
	rem,
} from "@mantine/core";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import FallbackComponent from "components/FallbackComponent";
import { APP_FORM } from "constants/appForm.js";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getApp } from "../../api/appCollectionApi";
import { ICON } from "../../constants/icons";
import BarSpinner from "../BarSpinner";
import EditView from "../EditView/EditView";
import { MarkPopulated, MarkUnPopulated, WarningSign } from "../Indicator";
import classes from "../MainView/MainView.module.css";

// FIXME: Refactor into smaller sub-components
const DetailView = (props) => {
	const { appKey, theme } = props;
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedApp, setSelectedApp] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const modalRef = useRef();
	const tags = appKey?.tags && JSON.parse(appKey.tags);
	let hasInstaller = false;
	let indicateEdit = false;

	useEffect(() => {
		getApp(appKey).then((app) => {
			setIsLoading(false);
			setSelectedApp(app);
			APP_FORM.formPartTwo.map((item) => {
				if (selectedApp[item.name] && selectedApp[item.name].length > 0) {
					hasInstaller = true;
					return;
				}
			});

			indicateEdit = appKey.edited ? (
				<ICON.check
					style={{
						width: rem(20),
						height: rem(20),
						position: "absolute",
						right: "50px",
						top: "45px",
						zIndex: "999999",
					}}
					stroke={2}
					color="green"
					title="Has been edited"
				/>
			) : null;
		});
	}, [appKey, hasInstaller, selectedApp, indicateEdit]);

	const edit = () => {
		setIsPopoverOpen(true);
	};

	const deleteApp = () => {};

	const closePopover = () => {
		setIsPopoverOpen(false);
	};

	return isLoading || !selectedApp ? (
		<BarSpinner />
	) : (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
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
								{indicateEdit}
							</h2>

							{selectedApp._short && (
								<Text className={classes.short}>{selectedApp._short}</Text>
							)}
							{selectedApp._desc && (
								<Text className={classes.desc}>{selectedApp._desc}</Text>
							)}

							<div className={classes.indicatorGroup}>
								<Text size="sm">
									{selectedApp._home ? <MarkPopulated /> : <MarkUnPopulated />}{" "}
									Homepage
								</Text>
								<Text size="sm">
									{selectedApp._docs ? <MarkPopulated /> : <MarkUnPopulated />}{" "}
									Documentation
								</Text>
								<Text size="sm">
									{selectedApp._github ? (
										<MarkPopulated />
									) : (
										<MarkUnPopulated />
									)}{" "}
									Github
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
									onClick={() => deleteApp(selectedApp.key)}
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
			{isPopoverOpen && (
				<EditView
					ref={modalRef}
					isPopoverOpen={isPopoverOpen}
					closePopover={closePopover}
					selectedApp={selectedApp}
					theme={theme}
				/>
			)}
		</ErrorBoundary>
	);
};

export default DetailView;
