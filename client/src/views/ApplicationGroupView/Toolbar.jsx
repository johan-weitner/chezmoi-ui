import { ActionIcon, Flex, Tooltip, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import SearchWidget from "views/ListView/SearchWidget";
import "components/neumorphic.css";

const Toolbar = (props) => {
	return (
		<Flex
			justify="flex-end"
			align="flex-end"
			gap="15"
			style={{
				position: "absolute",
				top: "30px",
				right: "30px",
			}}
		>
			{/* <SearchWidget /> */}
			<Tooltip label="Export Install.Doctor YAML file" position="bottom">
				<ActionIcon
					variant="filled"
					aria-label="Export Install.Doctor YAML file"
					size="xl"
					className="neubtn"
					onClick={() => window.open("http://localhost:3000/groupedApps")}
				>
					<IconDownload size={24} color="#999" />
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
};

export default Toolbar;
