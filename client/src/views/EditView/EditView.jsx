import { forwardRef, useEffect, useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { Card, Modal } from "@mantine/core";
import { randomId, useForceUpdate } from "@mantine/hooks";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";

const EditView = forwardRef(function EditView(props, ref) {
	const { theme } = props;
	const { editMode, setEditMode, selectedApp, gotoPrev, gotoNext } =
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
			onClose={() => setEditMode(false)}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="auto"
			transitionProps={{ duration: 2500, transition: "pop" }}
			shadow="xl"
			style={{
				height: "100vh !important",
				bottom: "0 !important",
				flexGrow: "1 !important",
				maxHeight: "fit-content !important",
				flexBasis: "fit-content !important",
				minHeight: "fit-content !important",
			}}
		>
			<Card style={{ backgroundColor: "#222" }}>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					{/* {rootStore.get.selectedApp() || isNewApp ? ( */}
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
					// ) : null}
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

// EditView.whyDidYouRender = true;
export default EditView;
