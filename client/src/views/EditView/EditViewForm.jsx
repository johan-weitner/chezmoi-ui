import { useSelector, useDispatch } from "react-redux";
import { Button, Flex } from "@mantine/core";
import btn from "components/Buttons.module.css";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { rootStore } from "store/store";
import css from "./EditView.module.css";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";
import GroupSection from "./GroupSection";
import { setEditMode } from "../../store/store";

const EditViewForm = (props) => {
	const dispatch = useDispatch();
	const [newApp, setNewApp] = useState(true);
	const [appTags, setAppTags] = useState();
	const [appGroups, setAppGroups] = useState();
	const [isDone, setIsDone] = useState(false);
	const {
		updateItem,
		saveNewItem,
		closePopover,
		setSelectedAppKey,
		tagApp,
		flagAppDone,
		getGroupsByApp,
	} = useClientManager();

	const { selectedApp, selectedAppKey, isNewApp, selectedAppGroups, editMode } =
		useSelector((state) => state.root);

	const defaultValues = newApp || !selectedApp ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		if (!selectedAppKey) {
			setNewApp(true);
			setIsDone(false);
			resetForm();
			return;
		}

		setNewApp(false);
		setIsDone(selectedApp?.done);
		reset(selectedApp);
	}, [selectedApp]);

	useEffect(() => {
		setIsDone(selectedApp?.done);
	}, []);

	const { formPartOne, formPartTwo } = APP_FORM;

	const onSubmit = (data) => {
		if (isNewApp) {
			saveNewItem(data, appTags);
		} else {
			updateItem(data, appTags);
		}
		setSelectedAppKey(null);
		dispatch(setEditMode(false));
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
		dispatch(setEditMode(false));
	};

	const flipDoneFlag = () => {
		flagAppDone(selectedApp, !isDone).then((app) => {
			setIsDone(!isDone);
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				padding: "0 !important",
				margin: "0 !important",
			}}
		>
			<h2 className={css.editDetailHeader}>
				{selectedApp?.name || "New application"}
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
					onClick={() => flipDoneFlag()}
					className={isDone ? btn.greenBtn : btn.cancelBtn}
					leftSection={isDone ? <ICON.check /> : null}
				>
					{isDone ? "Unmark" : "Mark"} as complete
				</Button>
				<Button onClick={() => closeModal()} className={btn.cancelBtn}>
					Cancel
				</Button>
				<Button
					type="submit"
					className={btn.saveBtn}
					leftSection={<ICON.save />}
				>
					Save
				</Button>
			</Flex>
			<InfoSection
				formPartOne={formPartOne}
				register={register}
				isNewApp={newApp}
			/>
			<GroupSection
				register={register}
				appKey={selectedApp?.key}
				isNewApp={newApp}
				tags={selectedAppGroups || []}
				editMode={editMode}
				hoistAppTags={hoistAppTags}
			/>
			<TagSection
				register={register}
				appKey={selectedApp?.key}
				isNewApp={newApp}
				tags={selectedApp?.tags || ""}
				editMode={editMode}
				hoistAppTags={hoistAppTags}
			/>
			<InstallerSection
				formPartTwo={formPartTwo}
				register={register}
				isNewApp={newApp}
			/>
		</form>
	);
};

export default EditViewForm;
