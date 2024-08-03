import {
	Autocomplete,
	Fieldset,
	InputBase,
	MultiSelect,
	Pill,
	TagsInput,
} from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { useClientManager } from "core/ClientManager";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { rootStore } from "store/store";

const GroupSection = (props) => {
	const dispatch = useDispatch();
	const { hoistAppTags, groups } = props;
	const [appGroups, setAppGroups] = useState();
	const {
		getAppTags,
		tagApp,
		getGroupsByApp,
		removeAllGroupRelations,
		putAppInGroup,
		kickAppFromGroup,
	} = useClientManager();

	const allGroups = useSelector((state) => state.root.appGroups);
	const whiteList = allGroups.map((group) => group.name);
	const selectedApp = useSelector((state) => state.root.selectedApp);
	const selectedAppGroups = useSelector((state) => state.root.selectedAppGroups);

	useEffect(() => {
		getGroupsByApp(selectedApp.id).then((groups) => {
			setAppGroups(selectedAppGroups?.map((group) => group.name));
		});
	}, []);

	useEffect(() => {
		// if (!rootStore.get.selectedApp()) return;
		getGroupsByApp(selectedApp.id).then((groups) => {
			setAppGroups(selectedAppGroups?.map((group) => group.name));
		});
	}, [rootStore.get.selectedAppKey()]);

	const getGroupId = (groupName) => {
		const found = allGroups.find((item) => item.name === groupName);
		return found ? found.id : -1;
	};

	const onRemove = (value) => {
		kickAppFromGroup(getGroupId(value), selectedApp.id).then(
			() => {
				setAppGroups(appGroups.filter((group) => group !== value));
			},
		);
	};

	const onChange = (value) => {
		const oldValues = appGroups;
		setAppGroups(value);
		if (value.length > oldValues.length) {
			const newGroup = value.filter((group) => !oldValues.includes(group));
			putAppInGroup(
				getGroupId(newGroup[0]),
				selectedApp.id,
			).then(() => {
				// console.log("GroupSection: Added app to group: ", newGroup);
			});
		}
	};

	return (
		<Fieldset legend="Group memberships">
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appGroups || []}
					data={whiteList}
					onChange={onChange}
					onRemove={onRemove}
					pointer
				/>
			</div>
		</Fieldset>
	);
};

export default GroupSection;
