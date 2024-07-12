import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { ActionIcon, Card, Flex, Modal, Text, rem } from "@mantine/core";
import { randomId, useForceUpdate } from "@mantine/hooks";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";

const EditView = forwardRef(function EditView(props, ref) {
	const {
		isPopoverOpen,
		closePopover,
		selectedApp,
		setSelectedAppKey,
		gotoPrev,
		gotoNext,
		theme,
	} = props;

	const [isNewApp, setIsNewApp] = useState(!selectedApp);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setIsNewApp(!selectedApp);
		forceUpdate();
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
			shadow="xl"
			style={
				{
					// height: "100vh !important",
					// maxHeight: "2000px !important",
					// bottom: "120px",
					// padding: "0 !important",
				}
			}
		>
			<Card
				style={{
					backgroundColor: "#222",
					// position: "fixed",
					// bottom: "50px",
					// top: "50px",
					// height: "90vh",
					// padding: "0 !important",
				}}
			>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					<EditViewForm
						isPopoverOpen={isPopoverOpen}
						closePopover={closePopover}
						selectedApp={selectedApp}
						setSelectedAppKey={setSelectedAppKey}
						gotoPrev={gotoPrev}
						gotoNext={gotoNext}
						theme={theme}
						isNewApp={isNewApp}
						forceUpdate={forceUpdate}
						randomId={randomId}
						// style={{ height: "90vh", padding: "0 !important" }}
					/>
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

export default EditView;
