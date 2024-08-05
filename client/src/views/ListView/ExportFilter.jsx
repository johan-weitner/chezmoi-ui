import {
	ActionIcon,
	Button,
	Group,
	Title,
	Text,
	useMantineTheme,
	Table,
	Checkbox,
	Card,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useClickOutside } from "@mantine/hooks";
import { useState } from "react";
import commonCss from "./ListView.module.css";
import "components/neumorphic.css";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import { log } from "utils/logger";

const ExportFilter = (props) => {
	const dispatch = useDispatch();
	const { setExportIsOpen } = props;
	const [selectedTags, setSelectedTags] = useState([]);
	const ref = useClickOutside(() => setExportIsOpen(false));
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		log.debug("Selected tags: ", selectedTags);
	}, [selectedTags]);

	const handleChange = (tagId, e) => {
		if (e.currentTarget.checked) {
			setSelectedTags([...selectedTags, tagId]);
		} else {
			setSelectedTags(selectedTags.filter((tag) => tag !== tagId));
		}
	};

	const downloadYaml = () => {
		log.debug("Download YAML filtered on tags: ", selectedTags);
		if (selectedTags.length === 0) return window.open(`${BASE_URL}/download`);
		window.open(`${BASE_URL}/filtered-download?tags=${selectedTags.join(",")}`);
	};

	return (
		<Card className={commonCss.modalCard} ref={ref}>
			<Title fw="normal" pt="20px" mb="20px">
				YAML Export
			</Title>
			<Text size="lg" mb="40px">
				Choose what tag(s) to filter the export on, or leave empty to export a
				complete list.
			</Text>
			<Table mb={30}>
				<Table.Thead>
					<Table.Tr>
						<Table.Th style={{ width: "120px" }}>Include</Table.Th>
						<Table.Th>Tag</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{useSelector((state) => state.root.allowedTags)?.map((tag) => (
						<Table.Tr key={nanoid()}>
							<Table.Td>
								<Checkbox
									id={tag.id}
									checked={selectedTags.includes(tag.id)}
									onChange={(e) => handleChange(tag.id, e)}
								/>
							</Table.Td>
							<Table.Td>
								<Text size="md">{tag.name}</Text>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Group justify="flex-end">
				<Button color="#933" onClick={() => setExportIsOpen(false)}>
					Cancel
				</Button>
				<Button onClick={() => downloadYaml()}>Download</Button>
			</Group>
			<ActionIcon
				size="sm"
				style={{ position: "absolute", top: "10px", right: "10px" }}
				onClick={() => setExportIsOpen(false)}
			>
				<IconX size={14} />
			</ActionIcon>
		</Card>
	);
};

export default ExportFilter;
