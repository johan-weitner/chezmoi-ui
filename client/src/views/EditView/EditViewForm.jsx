import { Button, Flex } from "@mantine/core";
import btn from "components/Buttons.module.css";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import { setEditMode } from "../../store/store";
import css from "./EditView.module.css";
import GroupSection from "./GroupSection";
import InfoSection from "./InfoSection";
import InstallerSection from "./InstallerSection";
import TagSection from "./TagSection";

const EditViewForm = (props) => {
	const dispatch = useDispatch();
	const [newApp, setNewApp] = useState(true);
	const [appTags, setAppTags] = useState();
	const [appGroups, setAppGroups] = useState();
	const [isDone, setIsDone] = useState(false);
	const [isIncluded, setIsIncluded] = useState(false);
	const { updateItem, saveNewItem, setSelectedAppKey, flagAppDone, flagAppIncluded } =
		useClientManager();

	const selectedApp = useSelector((state) => state.root.selectedApp);
	const selectedAppKey = useSelector((state) => state.root.selectedAppKey);
	const isNewApp = useSelector((state) => state.root.isNewApp);
	const libraryMode = useSelector((state) => state.root.libraryMode);

	const defaultValues = newApp || !selectedApp ? EMPTY_APP : selectedApp;
	const { register, handleSubmit, reset } = useForm({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		if (!selectedAppKey) {
			setNewApp(true);
			setIsDone(false);
			setIsIncluded(false);
			resetForm();
			return;
		}

		setNewApp(false);
		setIsDone(selectedApp?.done);
		setIsIncluded(selectedApp?.included);
		reset(selectedApp);
	}, [selectedApp]);

	useEffect(() => {
		setIsDone(selectedApp?.done);
		setIsIncluded(selectedApp?.included);
	}, []);

	const { formPartOne, formPartTwo } = APP_FORM;

	const onSubmit = (data) => {
		if (isNewApp) {
			saveNewItem(data, appTags, appGroups);
		} else {
			updateItem(data, appTags, appGroups);
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

	const flipIncludedFlag = () => {
		flagAppIncluded(selectedApp, !isIncluded).then((app) => {
			setIsIncluded(!isIncluded);
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={css.editForm}>
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
				className={css.formContainer}
			>
				<Button
					onClick={() => flipDoneFlag()}
					className={isDone ? btn.greenBtn : btn.cancelBtn}
					leftSection={isDone ? <ICON.check /> : null}
				>
					{isDone ? "Unmark" : "Mark"} as complete
				</Button>
				{libraryMode && (
					<Button
						onClick={() => flipIncludedFlag()}
						className={isIncluded ? btn.greenBtn : btn.cancelBtn}
						leftSection={isIncluded ? <ICON.check /> : null}
					>
						{isIncluded ? "Remove from" : "Include in"} collection
					</Button>
				)}
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
			<InfoSection formPartOne={formPartOne} register={register} />
			<GroupSection hoistAppGroups={setAppGroups} />
			<TagSection hoistAppTags={hoistAppTags} />
			<InstallerSection formPartTwo={formPartTwo} register={register} />
		</form>
	);
};

export default EditViewForm;
