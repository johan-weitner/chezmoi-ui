import { ActionIcon, Flex, Tooltip, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import "components/neumorphic.css";

const Toolbar = (props) => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
			<Tooltip label="Export Install.Doctor YAML file" position="bottom">
				<ActionIcon
					variant="filled"
					aria-label="Export Install.Doctor YAML file"
					size="xl"
					className="neubtn"
					onClick={() => window.open(`${BACKEND_URL}/groupedApps`)}
				>
					<IconDownload size={24} color="#999" />
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
};

export default Toolbar;
