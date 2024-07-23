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
import { useClientManager } from "core/ClientManager";
import { rootStore } from "../../store/store";

const EditViewForm = (props) => {
	const [isNewApp, setIsNewApp] = useState(true);
	const {
		updateItem,
		saveNewItem,
		closePopover,
		selectedApp,
		setSelectedAppKey,
	} = useClientManager();

	const defaultValues =
		isNewApp || !rootStore.get.selectedApp() ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset, watch, setValue } = useForm({
		defaultValues: defaultValues,
	});
	const [currentApp, setCurrentApp] = useState(selectedApp);
	const [currentTags, setCurrentTags] = useState([]);
	const debugMode = import.meta.env.VITE_DEBUG;

	useEffect(() => {
		const app = rootStore.get.selectedAppKey();
		console.log(app);
		if (!app) {
			console.log("EditViewForm: Is new app - resetting form");
			setIsNewApp(true);
			resetForm();
			return;
		}
		console.log("Is NOT new app");
		setIsNewApp(false);
		reset(rootStore.get.selectedApp());
	}, [rootStore.use.selectedApp()]);

	useEffect(() => {
		console.log("Watch form - Tags: ", watch().tags);
	}, [watch()]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const onSubmit = (data) => {
		if (rootStore.get.isNewApp()) {
			console.log("Saving NEW app");
			saveNewItem(data);
		} else {
			console.log("Updating EXISTING app");
			updateItem(data);
		}
		setSelectedAppKey(null);
		rootStore.set.editMode(false);
	};

	const resetForm = () => {
		console.log("Resetting form...");
		reset({
			defaultValues: EMPTY_APP,
		});
		// forceUpdate();
	};

	const hoistValues = (tags) => {
		console.log("Hoisting tags: ", tags);
		setCurrentTags(tags);
		setValue({ tags: tags });
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{ padding: "0 !important", margin: "0 !important" }}
		>
			<h2 className={css.editDetailHeader}>
				{rootStore.use.selectedApp()?.name || "New application"}
			</h2>
			{debugMode && (
				<Debugger
					selectedApp={selectedApp}
					isNewApp={isNewApp}
					resetForm={resetForm}
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
				tags={rootStore.use.selectedApp()?.tags || ""}
				editMode={rootStore.get.editMode()}
				hoistValues={hoistValues}
				setValue={setValue}
			/>
			{/* <input type="text" name="tags" {...register("tags")} /> */}
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
