import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { ActionIcon, Card, Flex, Modal, Text, rem } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";

const EditView = forwardRef(function EditView(props, ref) {
	const {
		isPopoverOpen,
		closePopover,
		selectedApp,
		gotoPrev,
		gotoNext,
		theme,
	} = props;

	const [isNewApp, setIsNewApp] = useState(!selectedApp);

	useEffect(() => {
		setIsNewApp(!selectedApp);
	}, [selectedApp]);

	return (
		<Modal
			opened={isPopoverOpen}
			keepMounted={false}
			onClose={closePopover}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="xl"
			transitionProps={{ duration: 2500, transition: "pop" }}
		>
			<Card style={{ backgroundColor: "#222" }}>
				<Flex justify="flex-end" gap={"sm"}>
					<>
						<Text size="sm">
							selectedApp: {selectedApp ? "true" : "false"} | isPopoverOpen:{" "}
							{isPopoverOpen ? "true" : "false"} | isNewApp:{" "}
							{isNewApp ? "true" : "false"}
						</Text>
						<ActionIcon
							size={32}
							radius="xl"
							color={theme.primaryColor}
							variant="filled"
							title="Go to previous app"
							onClick={() => gotoPrev()}
						>
							<IconPlayerTrackPrev
								style={{ width: rem(18), height: rem(18) }}
								stroke={1.5}
								color="white"
							/>
						</ActionIcon>
						<ActionIcon
							size={32}
							radius="xl"
							color={theme.primaryColor}
							variant="filled"
							title="Go to next app"
							onClick={() => gotoNext()}
						>
							<IconPlayerTrackNext
								style={{ width: rem(18), height: rem(18) }}
								stroke={1.5}
								color="white"
							/>
						</ActionIcon>
					</>
				</Flex>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					<EditViewForm
						isPopoverOpen={isPopoverOpen}
						closePopover={closePopover}
						selectedApp={selectedApp}
						gotoPrev={() => {}}
						gotoNext={() => {}}
						theme={theme}
						isNewApp={isNewApp}
					/>
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

export default EditView;
