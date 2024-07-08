import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const FallbackComponent = ({ error }) => {
	return (
		<Alert
			title="Error"
			color="red"
			icon={<IconAlertCircle />}
			variant="filled"
		>
			{error.message}
		</Alert>
	);
};

export default FallbackComponent;
