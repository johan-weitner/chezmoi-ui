import { forwardRef, useEffect, useState } from "react";
import { Card, Modal } from "@mantine/core";
import { randomId, useForceUpdate } from "@mantine/hooks";
import FallbackComponent from "components/FallbackComponent";
import { useClientManager } from "core/ClientManager";
import { ErrorBoundary } from "react-error-boundary";
import { rootStore } from "store/store";
import EditViewForm from "./EditViewForm";
import "../../App.css";

const EditView = forwardRef(function EditView(props, ref) {
	const { theme } = props;
	const { editMode, setIsEditMode, selectedApp, gotoPrev, gotoNext } =
		useClientManager();

	const [isNewApp, setIsNewApp] = useState(!selectedApp); // FIXME
	const forceUpdate = useForceUpdate();

	// FIXME
	useEffect(() => {
		setIsNewApp(!selectedApp);
		// forceUpdate();
	}, [selectedApp]);

	return (
		<Modal
			opened={rootStore.use.editMode()}
			keepMounted={false}
			onClose={() => setIsEditMode(false)}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="auto"
			// transitionProps={{ duration: 2500, transition: "pop" }}
			shadow="xl"
			fullScreen
			transitionProps={{ transition: "fade", duration: 200 }}
		>
			<Card style={{ backgroundColor: "#222" }}>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
					style={{ margin: "0 !important" }}
				>
					<EditViewForm
						isPopoverOpen={rootStore.use.editMode()}
						closePopover={() => rootStore.set.editMode(false)}
						selectedApp={rootStore.use.selectedApp()}
						setSelectedAppKey={() => {}}
						gotoPrev={gotoPrev}
						gotoNext={gotoNext}
						theme={theme}
						isNewApp={isNewApp}
						forceUpdate={forceUpdate}
						randomId={randomId}
					/>
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

// EditView.whyDidYouRender = true;
export default EditView;
