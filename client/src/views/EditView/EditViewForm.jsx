import { useState, useEffect } from "react";
import { Button, Group } from "@mantine/core";
import btn from "components/Buttons.module.css";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Debugger from "./Debugger";
import css from "./EditView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const [currentApp, setCurrentApp] = useState(null);
	const {
		addApp,
		updateItem: updateApp,
		closePopover,
		selectedApp,
		setSelectedAppKey,
		isNewApp,
		randomId,
	} = useClientManager();

	const defaultValues = isNewApp || !selectedApp ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: defaultValues,
	});
	const debugMode = import.meta.env.VITE_DEBUG;

	useEffect(() => {
		reset(selectedApp);
	}, [selectedApp]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const update = updateApp();
	console.log(update);
	const onSubmit = (data) => {
		try {
			if (isNewApp) {
				addApp(data).then((app) => {});
			} else {
				const res = update.mutate(data);
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
				{selectedApp?.name || "New application"}
			</h2>
			{debugMode && (
				<Debugger
					selectedApp={selectedApp}
					isNewApp={isNewApp}
					resetForm={resetForm}
					randomId={randomId}
				/>
			)}
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
