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

const TagSection = (props) => {
	const { tags, register, setValue } = props;
	const whiteList = mockTags.map((tag) => tag.name);

	const prepTags = (tags) => {
		if (!tags) return "mac, win";
	};

	const getArray = (tags) => {
		if (!tags) return [];
		// if(Array.isArray(tags)) return tags;
		// const arr = tags.split(",");
	};

	const getJson = (tags) => {
		if (!tags) return [];
		try {
			console.log("Tags: ", tags);
			console.log("Parsed tags: ", JSON.parse(tags));
			return JSON.parse(tags);
		} catch (e) {
			console.error(e);
			return [];
		}
	};

	useEffect(() => {
		getArray(tags);
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
					label="Press Enter to submit a tag"
					placeholder="Pick tag from list"
					data={whiteList}
					onChange={onChange}
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
