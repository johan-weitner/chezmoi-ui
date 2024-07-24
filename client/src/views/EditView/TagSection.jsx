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
	const { getAppTags } = useClientManager();
	const whiteList = rootStore.get.allowedTags().map((tag) => tag.name);

	useEffect(() => {
		getAppTags(rootStore.get.selectedApp().id).then((tags) => {
			console.log("Tag component got tags for app: ", tags);
			setAppTags(tags);
		});
	}, []);

	const getTagId = (tag) => {
		const found = mockTags.find((item) => item.name === tag);
		return found ? found.id : -1;
	};

	const onChange = (value) => {
		console.log("New tags: ", value);
		console.log("Is array: ", Array.isArray(value));
		const tagsIds = value.map((tag) => {
			return getTagId(tag);
		});
		setValue("tags", tagsIds);
	};

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<TagsInput
					label="Press Enter to submit a tag."
					placeholder="Pick tag from list"
					data={whiteList}
					onChange={onChange}
				/>
			</div>
		</Fieldset>
	);
};

export default TagSection;
