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
	const { getAppTags, tagApp, getGroupsByApp } = useClientManager();
	const whiteList = rootStore.get.appGroups().map((group) => group.name);

	useEffect(() => {
		// if (!rootStore.get.selectedApp()) return;
		getGroupsByApp(rootStore.get.selectedApp()?.id).then((groups) => {
			setAppGroups(groups);
		});
	}, [rootStore.get.selectedAppKey()]);

	const getTagId = (tagName) => {
		const tagListModel = rootStore.get.allowedTags();
		const found = tagListModel.find((item) => item.name === tagName);
		return found ? found.id : -1;
	};

	const getStrArray = (arr) => {
		return Array.isArray(arr) && arr.map((t) => t.name);
	};

	const onChange = (value) => {
		// const tagsIds = value.map((tag) => {
		// 	return getTagId(tag);
		// });
		// setAppTagIds("tags", tagsIds);
		// setAppTags(value);
		// hoistAppTags(tagsIds);
	};

	return (
		<Fieldset legend="Group memberships">
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={rootStore.use.selectedAppGroups() || []}
					data={whiteList}
					onChange={onChange}
					pointer
				/>
			</div>
		</Fieldset>
	);
};

export default GroupSection;
