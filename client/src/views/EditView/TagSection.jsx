import Tagify from "@yaireo/tagify";
import { useEffect } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { Fieldset } from "@mantine/core";
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";

const TagSection = (props) => {
	const { register, appKey, isNewApp } = props;
	window.TAGIFY_DEBUG = true;
	let tagifyInstance;

	useEffect(() => {
		tagifyInstance = new Tagify(document.querySelector("input[name=tags]"), {
			whitelist: TAGS_WHITE_LIST,
			enforceWhitelist: true,
			TAGIFY_DEBUG: false,
		});
	}, [tagifyInstance, appKey, isNewApp]);

	return (
		<Fieldset legend="Tags">
			<div style={{ width: "100%" }}>
				<input name="tags" {...register("tags")} />
			</div>
		</Fieldset>
	);
};

export default TagSection;
