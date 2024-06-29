import Tagify from "@yaireo/tagify";
import { nanoid } from "nanoid";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import "@yaireo/tagify/dist/tagify.css";
import {
	ActionIcon,
	Button,
	Card,
	Flex,
	Group,
	Input,
	SimpleGrid,
	Text,
	Textarea,
	rem,
} from "@mantine/core";
import { APP_FORM } from "../constants/appForm";
import { ICON } from "../constants/icons";
import { TAGS_WHITE_LIST } from "../constants/tagsWhiteList";
import classes from "./FeatureCards.module.css";

const AppForm = forwardRef(function AppForm(props, ref) {
	const { isPopoverOpen, setIsPopoverOpen, updateApp, selectedApp } = props;
	const { register, handleSubmit } = useForm({
		defaultValues: selectedApp,
	});

	window.TAGIFY_DEBUG = false;
	const { formPartOne, formPartTwo } = APP_FORM;

	useEffect(() => {
		const input = document.querySelector("input[name=tags]");
		new Tagify(input, { whitelist: TAGS_WHITE_LIST, enforceWhitelist: true });
	}, []);

	useHotkeys("esc", () => setIsPopoverOpen(false));

	const onSubmit = (data) => {
		updateApp(data);
	};

	return (
		selectedApp && (
			<Card
				ref={ref}
				className={isPopoverOpen ? classes.popup : classes.popupClosed}
				style={{ zIndex: "20000" }}
			>
				<Flex justify="flex-end">
					<ActionIcon
						size={32}
						radius="xl"
						color="#933"
						variant="filled"
						onClick={() => setIsPopoverOpen(false)}
					>
						<ICON.close
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Flex>

				<form onSubmit={handleSubmit(onSubmit)}>
					<h2 className={classes.editDetailHeader}>{selectedApp?._name}</h2>
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
						cols={{ base: 1, md: 3 }}
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
							onClick={() => setIsPopoverOpen(false)}
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
		)
	);
});

export default AppForm;
