import { Button, Group } from "@mantine/core";
import { addApp, useAppMutation } from "api/appCollectionApi";
import btn from "components/Buttons.module.css";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Debugger from "./Debugger";
import css from "./EditView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const {
		closePopover,
		selectedApp,
		setSelectedAppKey,
		isNewApp,
		forceUpdate,
		randomId,
	} = props;
	const defaultValues = isNewApp || !selectedApp ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: defaultValues,
	});

	// useEffect(() => {
	// 	reset({
	// 		values: {}
	// 	});
	// 	forceUpdate();
	// }, [selectedApp, isNewApp, reset]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const updateApp = useAppMutation();
	const onSubmit = (data) => {
		try {
			if (isNewApp) {
				console.log("Is new app");
				addApp(data).then((app) => {
					console.log("Done");
				});
			} else {
				console.log("Updating with data: ", data);
				// updateApp.mutateAsync(data).then((app) => {
				const res = updateApp.mutate(data);
				console.log("Res: ");
			}
			setSelectedAppKey(null);
			closePopover();
		} catch (error) {
			const str = isNewApp ? "add" : "update";
			console.error(`Failed to ${str} app`, error);
			toast.error(`Failed to ${str} app`);
		}
	};

	const resetForm = () => {
		console.log("Resetting form...");
		reset({
			defaultValues: EMPTY_APP,
		});
		forceUpdate();
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{ padding: "0 !important", margin: "0 !important" }}
		>
			<h2 className={css.editDetailHeader}>
				{selectedApp?._name || "New application"}
			</h2>
			<Debugger
				selectedApp={selectedApp}
				isNewApp={isNewApp}
				resetForm={resetForm}
				randomId={randomId}
			/>
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
				<Button onClick={() => closePopover()} className={btn.cancelBtn}>
					Cancel
				</Button>
				<Button
					type="submit"
					className={btn.saveBtn}
					leftSection={<ICON.save />}
				>
					Save
				</Button>
			</Group>
		</form>
	);
};

export default EditViewForm;
