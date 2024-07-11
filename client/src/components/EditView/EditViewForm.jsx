import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Group, Text } from "@mantine/core";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";

import { addApp, useAppMutation } from "api/appCollectionApi";
import classes from "../MainView/MainView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const { closePopover, selectedApp, theme, isNewApp, forceUpdate, randomId } =
		props;
	const defaultValues = isNewApp || !selectedApp ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		reset({
			values: {},
			keepDirty: false,
			keepDirtyFields: false,
			keepValues: false,
			keepDefaultValues: false,
		});
		forceUpdate();
	}, [selectedApp, isNewApp, reset]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const updateApp = useAppMutation();
	const onSubmit = async (data) => {
		console.log("updateApp", updateApp);
		if (isNewApp) {
			addApp(data);
		} else {
			await updateApp.mutate(data);
		}
		setSelectedApp(null);
		closePopover();
	};

	const resetForm = () => {
		console.log("Resetting form...");
		const res = reset({
			defaultValues: EMPTY_APP,
			keepDirty: false,
			keepDirtyFields: false,
			keepValues: false,
			keepDefaultValues: false,
		});
		forceUpdate();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 className={classes.editDetailHeader}>
				{selectedApp?._name || "New application"}
			</h2>
			<Text size="sm">
				selectedApp: {selectedApp ? "true" : "false"} | isNewApp:{" "}
				{isNewApp ? "true" : "false"} | RandomId: {randomId()}
			</Text>
			<button
				type="button"
				onClick={() => {
					resetForm();
				}}
			>
				Reset
			</button>

			<InfoSection
				formPartOne={formPartOne}
				register={register}
				isNewApp={isNewApp}
			/>
			<TagSection
				register={register}
				appKey={selectedApp?.key}
				isNewApp={isNewApp}
			/>
			<InstallerSection
				formPartTwo={formPartTwo}
				register={register}
				isNewApp={isNewApp}
			/>

			<Group justify="center">
				<Button onClick={() => closePopover()} className={classes.cancelBtn}>
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
	);
};

export default EditViewForm;
