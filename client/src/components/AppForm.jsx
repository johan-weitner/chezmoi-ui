import { useDisclosure } from "@mantine/hooks";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import Tagify from "@yaireo/tagify";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@yaireo/tagify/dist/tagify.css";
import {
	ActionIcon,
	Button,
	Card,
	Flex,
	Group,
	Input,
	Modal,
	SimpleGrid,
	Text,
	Textarea,
	rem,
} from "@mantine/core";
import { APP_FORM } from "constants/appForm";
import { ICON } from "constants/icons";
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";
import { useAppMutation } from "../api/appCollectionApi";
import classes from "./MainView.module.css";

const AppForm = forwardRef(function AppForm(props, ref) {
	const {
		isPopoverOpen,
		closePopover,
		selectedApp,
		gotoPrev,
		gotoNext,
		theme,
		isNewApp,
	} = props;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: isNewApp ? null : selectedApp,
	});

	// const { data, isLoading } = useDataQuery();

	const [opened, { open, close }] = useDisclosure(true);
	let tagifyInstance;

	useEffect(() => {
		reset(selectedApp);
	}, [selectedApp, isPopoverOpen, isNewApp, reset]);

	window.TAGIFY_DEBUG = true;
	const { formPartOne, formPartTwo } = APP_FORM;

	if (!tagifyInstance) {
		tagifyInstance = new Tagify(document.querySelector("input[name=tags]"), {
			whitelist: TAGS_WHITE_LIST,
			enforceWhitelist: true,
			TAGIFY_DEBUG: false,
		});
	}
	const updateApp = useAppMutation();
	const onSubmit = async (data) => {
		console.log('updateApp', updateApp);
		await updateApp.mutate(data);
		closePopover();
	};

	return (
		<Modal
			opened={isPopoverOpen}
			keepMounted
			onClose={closePopover}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="xl"
		>
			<Card>
				<Flex justify="flex-end" gap={"sm"}>

					<>
						<ActionIcon
							size={32}
							radius="xl"
							color={theme.primaryColor}
							variant="filled"
							title="Go to previous app"
							onClick={() => gotoPrev()}
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
						>
							<IconPlayerTrackNext
								style={{ width: rem(18), height: rem(18) }}
								stroke={1.5}
								color="white"
							/>
						</ActionIcon>
					</>


					{/*<ActionIcon
						size={32}
						radius="xl"
						color="#933"
						variant="filled"
						title="Close edit popover"
						onClick={() => closePopover()}
					>
						<ICON.close
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>*/}
				</Flex>

				<form onSubmit={handleSubmit(onSubmit)}>
					<h2 className={classes.editDetailHeader}>
						{selectedApp?._name || "New application"}
					</h2>
					<h3
						style={{
							textAlign: "left",
							fontSize: "1.8em",
							fontWeight: "normal",
							marginTop: "0",
						}}
					>
						Info
					</h3>
					<SimpleGrid
						cols={{ base: 1, md: 2 }}
						spacing="sm"
						mt={50}
						className={classes.grid}
						style={{ marginBottom: "-20px" }}
					>
						{formPartOne.map((item) => {
							return (
								<Group
									display="block"
									className={classes.fieldcontainer}
									key={nanoid()}
								>
									<Text
										component="label"
										htmlFor={item.name}
										size="sm"
										fw={500}
									>
										{item.label}
									</Text>
									<Input id={item.name} {...register(item.name)} />
								</Group>
							);
						})}
					</SimpleGrid>

					<SimpleGrid
						cols={{ base: 1, md: 1 }}
						spacing="sm"
						mt={50}
						className={classes.grid}
						style={{ marginBottom: "0", marginTop: "-20px", paddingTop: "0" }}
					>
						<Group display="block" className={classes.fieldcontainer}>
							<Text component="label" htmlFor="_desc" size="sm" fw={500}>
								Description
							</Text>
							<Textarea id="_desc" rows="8" {...register("_desc")} />
						</Group>
					</SimpleGrid>

					<h3
						style={{
							textAlign: "left",
							fontSize: "1.8em",
							fontWeight: "normal",
							marginTop: "0",
						}}
					>
						Tags
					</h3>
					<div style={{ marginBottom: "40px", width: "100%" }}>
						<input name="tags" {...register("tags")} />
					</div>

					<h3
						style={{
							textAlign: "left",
							fontSize: "1.8em",
							fontWeight: "normal",
							marginTop: "0",
						}}
					>
						Installers
					</h3>
					<SimpleGrid
						cols={{ base: 1, md: 4 }}
						spacing="sm"
						mt={50}
						className={classes.grid}
					>
						{formPartTwo.map((item) => {
							return (
								<Group
									display="block"
									className={classes.fieldcontainer}
									key={nanoid()}
								>
									<Text
										component="label"
										htmlFor={item.name}
										size="sm"
										fw={500}
									>
										{item.label}
									</Text>
									<Input id={item.name} {...register(item.name)} />
								</Group>
							);
						})}
					</SimpleGrid>

					<Group justify="center">
						<Button
							onClick={() => closePopover()}
							className={classes.cancelBtn}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className={classes.saveBtn}
							leftSection={<ICON.save />}
						>
							Save
						</Button>
					</Group>
				</form>
			</Card>
		</Modal>
	);
});

export default AppForm;
