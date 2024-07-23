import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import {
	MultiSelect,
	Autocomplete,
	Pill,
	InputBase,
	Fieldset,
} from "@mantine/core";
import { TAGS_WHITE_LIST, getTagsWhiteList } from "constants/tagsWhiteList";
import { rootStore } from "store/store";

const TagSection = (props) => {
	const { tags, register, setValue } = props;
	const [currentTags, setCurrentTags] = useState(tags);
	// const tagOptions = getTagsWhiteList();
	// console.log("TagOptions: ", tagOptions);

	const reactTags = useRef();

	const prepTags = (tags) => {
		if (!tags) return "mac, win";
	};

	const getArray = (tags) => {
		if (!tags) return [];
		const arr = tags.split(",");
		console.log("getArray: ", arr);
	};

	useEffect(() => {
		getArray(tags);
	}, []);

	const onChange = (value) => {
		console.log("Tags: ", value);
		// setCurrentTags(value);
		setValue("tags", value);
	};

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<MultiSelect
					label="Tags"
					placeholder="Choose tags"
					defaultValue={JSON.parse(tags) || tags}
					data={TAGS_WHITE_LIST}
					onChange={(value) => {
						onChange(value);
					}}
				/>
				<input
					type="text"
					name="tags"
					defaultValue={tags}
					{...register("tags")}
				/>
			</div>
		</Fieldset>
	);
};

export default TagSection;
