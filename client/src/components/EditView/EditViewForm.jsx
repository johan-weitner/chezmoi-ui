import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Group } from "@mantine/core";
import { APP_FORM } from "constants/appForm";
import { ICON } from "constants/icons";

import { addApp, useAppMutation } from "api/appCollectionApi";
import classes from "../MainView/MainView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const { closePopover, selectedApp, theme, isNewApp } = props;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: isNewApp ? null : selectedApp,
	});

	useEffect(() => {
		reset(selectedApp);
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

		closePopover();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 className={classes.editDetailHeader}>
				{selectedApp?._name || "New application"}
			</h2>

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
