import {
	Autocomplete,
	Fieldset,
	InputBase,
	MultiSelect,
	Pill,
	TagsInput,
	ActionIcon,
	Tooltip,
} from "@mantine/core";
import { ICON } from "constants/icons";
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
			// console.log("Tags: ", tags);
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
		<Fieldset legend="Tags" style={{ position: "relative" }}>
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appTags || []}
					data={whiteList}
					onChange={onChange}
					pointer
				/>
			</div>
			<Tooltip label="Edit tag collection">
				<ActionIcon
					variant="light"
					p={0}
					size={40}
					style={{
						borderRadius: "50%",
						position: "absolute",
						top: "-45px",
						right: "10px",
					}}
				>
					<ICON.edit />
				</ActionIcon>
			</Tooltip>
		</Fieldset>
	);
};

export default TagSection;
