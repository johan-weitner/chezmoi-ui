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

const TagSection = (props) => {
	const { hoistAppTags } = props;
	const [appTags, setAppTags] = useState();
	const [appTagIds, setAppTagIds] = useState();
	const { getAppTags, tagApp } = useClientManager();
	const whiteList = rootStore.get.allowedTags().map((tag) => tag.name);

	useEffect(() => {
		if (!rootStore.get.selectedApp()) return;
		getAppTags(rootStore.get.selectedApp().id).then((tags) => {
			setAppTags(getStrArray(tags));
		});
	}, []);

	const getTagId = (tagName) => {
		const tagListModel = rootStore.get.allowedTags();
		const found = tagListModel.find((item) => item.name === tagName);
		return found ? found.id : -1;
	};

	const getStrArray = (arr) => {
		return Array.isArray(arr) && arr.map((t) => t.name);
	};

	const onChange = (value) => {
		const tagsIds = value.map((tag) => {
			return getTagId(tag);
		});
		setAppTagIds("tags", tagsIds);
		setAppTags(value);
		hoistAppTags(tagsIds);
	};

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appTags || []}
					data={whiteList}
					onChange={onChange}
					pointer
				/>
			</div>
		</Fieldset>
	);
};

export default TagSection;
