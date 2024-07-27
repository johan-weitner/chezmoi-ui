import { Button, Flex } from "@mantine/core";
import btn from "components/Buttons.module.css";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { rootStore } from "../../store/store";
import css from "./EditView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const [isNewApp, setIsNewApp] = useState(true);
	const [appTags, setAppTags] = useState();
	const {
		updateItem,
		saveNewItem,
		closePopover,
		selectedApp,
		setSelectedAppKey,
		tagApp,
	} = useClientManager();

	const defaultValues =
		isNewApp || !rootStore.get.selectedApp() ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset, watch, setValue } = useForm({
		defaultValues: defaultValues,
	});
	const debugMode = import.meta.env.VITE_DEBUG;

	useEffect(() => {
		const app = rootStore.get.selectedAppKey();
		if (!app) {
			setIsNewApp(true);
			resetForm();
			return;
		}
		setIsNewApp(false);
		reset(rootStore.get.selectedApp());
	}, [rootStore.use.selectedApp()]);

	const { formPartOne, formPartTwo } = APP_FORM;

	const onSubmit = (data) => {
		if (rootStore.get.isNewApp()) {
			saveNewItem(data, appTags);
		} else {
			updateItem(data, appTags);
		}
		setSelectedAppKey(null);
		rootStore.set.editMode(false);
	};

	const resetForm = () => {
		reset({
			defaultValues: EMPTY_APP,
		});
	};

	const hoistAppTags = (tagsIds) => {
		setAppTags(tagsIds);
	};

	const closeModal = () => {
		rootStore.set.editMode(false);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				padding: "0 !important",
				margin: "0 !important",
			}}
		>
			<h2 className={css.editDetailHeader} data-testid="editViewHeader">
				{rootStore.use.selectedApp()?.name || "New application"}
			</h2>
			<Flex
				mih={50}
				bg="rgba(0, 0, 0, .3)"
				gap="md"
				justify="flex-end"
				align="flex-start"
				direction="row"
				wrap="wrap"
				style={{
					backgroundColor: "#222",
					position: "absolute",
					top: "30px",
					right: "15px",
					zIndex: "9999",
				}}
			>
				<Button
					onClick={() => closeModal()}
					className={btn.cancelBtn}
					data-testid="editViewCancelBtn"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					className={btn.saveBtn}
					leftSection={<ICON.save />}
					data-testid="editViewSaveBtn"
				>
					Save
				</Button>
			</Flex>
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
				hoistAppTags={hoistAppTags}
			/>
			<InstallerSection
				formPartTwo={formPartTwo}
				register={register}
				isNewApp={isNewApp}
			/>
		</form>
	);
};

export default EditViewForm;
