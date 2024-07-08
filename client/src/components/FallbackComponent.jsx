import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const FallbackComponent = ({ error }) => {
	return (
		<Alert
			title="Error"
			color="red"
			icon={<IconAlertCircle />}
			variant="outline"
		>
			{error?.message || error}
		</Alert>
	);
};

export default FallbackComponent;
