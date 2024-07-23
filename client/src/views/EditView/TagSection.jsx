import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { Fieldset } from "@mantine/core";
import { TAGS_WHITE_LIST, getTagsWhiteList } from "constants/tagsWhiteList";
import { rootStore } from "store/store";

const TagSection = (props) => {
	const { hoistValues, register } = props;
	const [tags, setTags] = useState([]);

	const [suggestions, setSuggestions] = useState(getTagsWhiteList() || []);

	const reactTags = useRef();

	const onDelete = useCallback(
		(tagIndex) => {
			setTags(tags.filter((_, i) => i !== tagIndex));
			// setTagFieldValue(JSON.stringify(stripTags(tags)));
			// hoistValues([tags]);
		},
		[tags],
	);

	const onAddition = useCallback(
		(newTag) => {
			setTags([...tags, newTag]);
			// setTagFieldValue(JSON.stringify(stripTags(tags)));
			// hoistValues(tags);
		},
		[tags],
	);

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<p>Not impl</p>
			</div>
		</Fieldset>
	);
};

export default TagSection;
