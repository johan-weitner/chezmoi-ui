import {
	Autocomplete,
	Fieldset,
	InputBase,
	MultiSelect,
	Pill,
	TagsInput,
} from "@mantine/core";
import { useClientManager } from "core/ClientManager";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { rootStore } from "store/store";

const GroupSection = (props) => {
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
	const whiteList = rootStore.get.appGroups().map((group) => group.name);

	useEffect(() => {
		getGroupsByApp(rootStore.get.selectedApp().id).then((groups) => {
			const grps = rootStore.get.selectedAppGroups();
			console.log("Groups: ", groups);
			setAppGroups(grps?.map((group) => group.name));
			// setAppGroups(grps);
			console.log("GroupSection: App groups in local state: ", appGroups);
		});
	}, []);

	useEffect(() => {
		// if (!rootStore.get.selectedApp()) return;
		getGroupsByApp(rootStore.get.selectedApp().id).then((groups) => {
			const grps = rootStore.get.selectedAppGroups();
			console.log("Groups: ", groups);
			setAppGroups(grps?.map((group) => group.name));
			// setAppGroups(grps);
			console.log("GroupSection: App groups in local state: ", appGroups);
		});
	}, [rootStore.get.selectedAppKey()]);

	const getGroupId = (groupName) => {
		const groupListModel = rootStore.get.appGroups();
		const found = groupListModel.find((item) => item.name === groupName);
		return found ? found.id : -1;
	};

	const getStrArray = (arr) => {
		return Array.isArray(arr) && arr.map((t) => t.name);
	};

	const saveGroupRelations = (groupIds) => {
		const groups = groupIds.map((group) => {
			return getGroupId(group);
		});
		removeAllGroupRelations(rootStore.get.selectedApp().id).then(() => {
			const promises = groups.map((groups) => {
				return putAppInGroup(group, rootStore.get.selectedApp().id);
			});
		});
	};

	const onRemove = (value) => {
		// (groupId, appId)
		kickAppFromGroup(getGroupId(value), rootStore.get.selectedApp().id).then(
			() => {
				console.log("GroupSection: Removed app from group: ");
				setAppGroups(appGroups.filter((group) => group !== value));
			},
		);
	};

	const onChange = (value) => {
		console.log("GroupSection: OnChange value: ", value);
		const oldValues = appGroups;
		setAppGroups(value);
		if (value.length > oldValues.length) {
			const newGroup = value.filter((group) => !oldValues.includes(group));
			putAppInGroup(
				getGroupId(newGroup[0]),
				rootStore.get.selectedApp().id,
			).then(() => {
				console.log("GroupSection: Added app to group: ", newGroup);
			});
		}
		// const groupIds = value.map((group) => {
		// 	return getGroupId(group);
		// });
		// setAppTagIds("tags", groupIds);
		// setAppTags(value);
		// hoistAppTags(groupIds);
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
