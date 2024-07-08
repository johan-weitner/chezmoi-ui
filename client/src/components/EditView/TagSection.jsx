import Tagify from "@yaireo/tagify";
import { useEffect } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";

const TagSection = (props) => {
	const { register, appKey } = props;
	window.TAGIFY_DEBUG = true;
	let tagifyInstance;

	useEffect(() => {
		tagifyInstance = new Tagify(document.querySelector("input[name=tags]"), {
			whitelist: TAGS_WHITE_LIST,
			enforceWhitelist: true,
			TAGIFY_DEBUG: false,
		});
	}, [tagifyInstance]);

	return (
		<>
			<h3
				style={{
					textAlign: "left",
					fontSize: "1.8em",
					fontWeight: "normal",
					marginTop: "0",
				}}
			>
				Tags
			</h3>
			<div style={{ marginBottom: "40px", width: "100%" }}>
				<input name="tags" {...register("tags")} />
			</div>
		</>
	);
};

export default TagSection;
