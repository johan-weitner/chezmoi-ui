import {
	Fieldset,
	TagsInput,
	ActionIcon,
	Tooltip,
	Card,
	Title,
	Flex,
	Button,
} from "@mantine/core";
import { useSelector } from "store/store";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useState } from "react";
import { useEffect } from "react";
import { getTagId } from "api/fetchApi";

const TagSection = (props) => {
	const { hoistAppTags } = props;
	const [appTags, setAppTags] = useState();
	const selectedApp = useSelector((state) => state.root.selectedApp);
	const allowedTags = useSelector((state) => state.root.allowedTags);
	const [editTagList, setEditTagList] = useState(false);
	const { updateAllowedTags } = useClientManager();
	const whiteList = allowedTags.map((tag) => tag.name);
	const [tagList, setTagList] = useState(whiteList);

	useEffect(() => {
		if (!selectedApp) return;
		setAppTags(getStrArray(selectedApp.appTags));
		setTagList(allowedTags.map((tag) => tag.name));
	}, []);

	useEffect(() => {
		if (!selectedApp) return;
		setAppTags(getStrArray(selectedApp.appTags));
	}, [selectedApp]);

	useEffect(() => {
		setTagList(allowedTags.map((tag) => tag.name));
	}, [allowedTags]);

	const getStrArray = (arr) => {
		return Array.isArray(arr) && arr.map((t) => t.name);
	};

	const onChange = (value) => {
		const tagsIds = value.map((tag) => {
			return getTagId(tag);
		});
		setAppTags(value);
		hoistAppTags(tagsIds);
	};

	const onChangeTagList = (value) => {
		setTagList(value);
	};

	const saveTagListChanges = (tags) => {
		updateAllowedTags(tags).then((newTags) => {
			setTagList(newTags);
			setEditTagList(false);
		});
	};

	return (
		<Fieldset legend="Tags" style={{ position: "relative" }}>
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appTags || []}
					data={allowedTags.map((tag) => tag.name)}
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
			{editTagList && (
				<Card mt={10}>
					<Title fw="normal" size="xl">
						Edit tags
					</Title>
					<TagsInput
						placeholder="Click to edit"
						value={tagList || []}
						onChange={onChangeTagList}
						pointer
					/>
					<Flex justify="end">
						<Button onClick={() => saveTagListChanges(tagList)}>Save</Button>
					</Flex>
				</Card>
			)}
		</Fieldset>
	);
};

export default TagSection;
