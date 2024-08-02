import {
	Fieldset,
	TagsInput,
	ActionIcon,
	Tooltip,
	Card,
	Title,
	Flex,
	Button
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
	const [editTagList, setEditTagList] = useState(false);
	const { getAppTags, tagApp, updateAllowedTags } = useClientManager();
	const whiteList = rootStore.get.allowedTags().map((tag) => tag.name);
	const [tagList, setTagList] = useState(whiteList);

	useEffect(() => {
		if (!rootStore.get.selectedApp()) return;
		getAppTags(rootStore.get.selectedApp().id).then((tags) => {
			// console.log("Tags: ", tags);
			setAppTags(getStrArray(tags));
		});
		setTagList(rootStore.get.allowedTags().map((tag) => tag.name))
	}, []);

	useEffect(() => {
		setTagList(rootStore.get.allowedTags().map((tag) => tag.name))
	}, [rootStore.get.allowedTags()]);

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

	const onChangeTagList = (value) => {
		setTagList(value);
		// updateAllowedTags(value).then(() => {
		// 	setTagList(value);
		// });
	};

	const saveTagListChanges = tags => {
		updateAllowedTags(tags).then((newTags) => {
			setTagList(newTags);
			setEditTagList(false);
		});
	}

	return (
		<Fieldset legend="Tags" style={{ position: "relative" }}>
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appTags || []}
					data={whiteList}
					onChange={onChange}
					pointer
					disabled={editTagList}
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
					onClick={() => setEditTagList(!editTagList)}
				>
					<ICON.edit />
				</ActionIcon>
			</Tooltip>
			{editTagList && (<Card mt={10}>
				<Title fw="normal" size="xl">Edit  tags</Title>
				<TagsInput
					placeholder="Click to edit"
					value={tagList || []}
					onChange={onChangeTagList}
					pointer
					disabled={!editTagList}
				/>
				<Flex justify="end">
					<Button onClick={ () => saveTagListChanges(tagList)}>Save</Button>
				</Flex>
			</Card>)}
		</Fieldset>
	);
};

export default TagSection;
