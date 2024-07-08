import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Group } from "@mantine/core";
import { APP_FORM } from "constants/appForm";
import { ICON } from "constants/icons";

import { useAppMutation } from "../../api/appCollectionApi";
import classes from "../MainView/MainView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props, ref) => {
	const { closePopover, selectedApp, theme, isNewApp } = props;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: isNewApp ? null : selectedApp,
	});

	const [opened, { open, close }] = useDisclosure(true);

	useEffect(() => {
		reset(selectedApp);
	}, [selectedApp, reset]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const updateApp = useAppMutation();
	const onSubmit = async (data) => {
		console.log("updateApp", updateApp);
		await updateApp.mutate(data);
		closePopover();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 className={classes.editDetailHeader}>
				{selectedApp?._name || "New application"}
			</h2>

			<InfoSection formPartOne={formPartOne} register={register} />
			<TagSection register={register} appKey={selectedApp.key} />
			<InstallerSection formPartTwo={formPartTwo} register={register} />

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
