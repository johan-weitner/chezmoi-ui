import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Group } from "@mantine/core";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";

import { addApp, useAppMutation } from "api/appCollectionApi";
import btn from "components/Buttons.module.css";
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
		theme,
		isNewApp,
		forceUpdate,
		randomId,
	} = props;
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
	// const onSubmit = async (data) => {
	// 	console.log("updateApp", updateApp);
	// 	console.log("with: ", data);
	// 	if (isNewApp) {
	// 		console.log("Is new app");
	// 		await addApp(data);
	// 		console.log("Done");
	// 	} else {
	// 		console.log("Updating app with");
	// 		await updateApp.mutate(data);
	// 		console.log("Done");
	// 	}
	// 	setSelectedAppKey(null);
	// 	closePopover();
	// };
	const onSubmit = async (data) => {
		console.log("updateApp", updateApp);
		console.log("with: ", data);
		try {
			if (isNewApp) {
				console.log("Is new app");
				addApp(data); // Ensure addApp is properly handling async operations.
				console.log("Done");
			} else {
				console.log("Updating app with");
				updateApp.mutateAsync(data); // Use mutateAsync to wait for completion.
				console.log("Done");
			}
			setSelectedAppKey(null);
			closePopover();
		} catch (error) {
			console.error("Failed to update app:", error);
			const str = isNewApp ? "add" : "update";
			toast.error(`Failed to ${str} app: ${error.message}`);
		}
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
