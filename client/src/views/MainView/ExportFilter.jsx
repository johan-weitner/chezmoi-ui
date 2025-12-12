import {
	ActionIcon,
	Button,
	Card,
	Checkbox,
	Group,
	Switch,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import commonCss from "views/ListView/ListView.module.css";
import "components/neumorphic.css";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useSelector } from "store/store";
import { log } from "utils/logger";

const ExportFilter = (props) => {
	const { setExportIsOpen } = props;
	const [selectedTags, setSelectedTags] = useState([]);
	const [useLibraryMode, setUseLibraryMode] = useState(false);
	const ref = useClickOutside(() => setExportIsOpen(false));
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;
	const libraryMode = useSelector((state) => state.root.libraryMode);

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
		const libraryParam = useLibraryMode ? '&libraryMode=true' : '';
		if (selectedTags.length === 0) return window.open(`${BASE_URL}/download?libraryMode=${useLibraryMode}`);
		window.open(`${BASE_URL}/filtered-download?tags=${selectedTags.join(",")}${libraryParam}`);
	};

	return (
		<Card className={commonCss.modalCard} ref={ref}>
			<Title fw="normal" pt="20px" mb="20px">
				YAML Export
			</Title>
			{libraryMode && (
				<Switch
					label="Library Mode: Only export apps marked as included"
					checked={useLibraryMode}
					onChange={(event) => setUseLibraryMode(event.currentTarget.checked)}
					mb="20px"
					size="md"
				/>
			)}
			<Text size="lg" mb="40px">
				{useLibraryMode 
					? "Only apps you've marked for inclusion will be exported. Optionally filter by tag(s) below."
					: "Choose what tag(s) to filter the export on, or leave empty to export the whole list."}
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
