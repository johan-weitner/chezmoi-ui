import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import {
	TagsInput,
	MultiSelect,
	Autocomplete,
	Pill,
	InputBase,
	Fieldset,
} from "@mantine/core";
import { mockTags } from "constants/tagsWhiteList";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";

const TagSection = (props) => {
	const { tags, register, setValue } = props;
	const [appTags, setAppTags] = useState();
	const [appTagIds, setAppTagIds] = useState();
	const { getAppTags, tagApp } = useClientManager();
	const whiteList = rootStore.get.allowedTags().map((tag) => tag.name);

	useEffect(() => {
		getAppTags(rootStore.get.selectedApp().id).then((tags) => {
			console.log("Tag component got tags for app: ", tags);
			setAppTags(getStrArray(tags));
		});
	}, []);

	const getTagId = (tag) => {
		const found = mockTags.find((item) => item.name === tag);
		return found ? found.id : -1;
	};

	const getStrArray = (arr) => {
		console.log("Is array: ", Array.isArray(arr), arr);
		return Array.isArray(arr) && arr.map((t) => t.name);
	};

	const onChange = (value) => {
		console.log("New tags: ", value);
		// console.log("Is array: ", Array.isArray(value));
		const tagsIds = value.map((tag) => {
			return getTagId(tag);
		});
		try {
			tagApp(rootStore.get.selectedApp().id, tagsIds).then((res) => {
				console.log(res);
				setAppTagIds("tags", tagsIds);
				setAppTags(value);
			});
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<TagsInput
					label="Press Enter to submit a tag."
					placeholder="Pick tag from list"
					value={appTags || []}
					data={whiteList}
					onChange={onChange}
					pointer
				/>
			</div>
			<pre>{JSON.stringify(whiteList, null, 2)}</pre>
		</Fieldset>
	);
};

export default TagSection;
