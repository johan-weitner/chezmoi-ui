import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { ActionIcon, Card, Flex, Modal, Text, rem } from "@mantine/core";
import { useClient } from "../../core/ClientProvider";
import { randomId, useForceUpdate } from "@mantine/hooks";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";

const EditView = forwardRef(function EditView(props, ref) {
	const { theme } = props;
	const {
		allApps,
		totalApps,
		populateList,
		initPagination,
		editItem,
		editMode,
		setEditMode,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
		selectedAppKey: appKey,
		page,
		limit,
		totalCount,
		pageCount,
		setPage,
		setLimit,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		applyFilter,
		restoreFilters,
		activeFilter,
	} = useClient();

	const [isNewApp, setIsNewApp] = useState(!selectedApp);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setIsNewApp(!selectedApp);
		forceUpdate();
	}, [selectedApp]);

	return (
		<Modal
			opened={editMode}
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
					{selectedApp || isNewApp ? (
						<EditViewForm
							isPopoverOpen={editMode}
							closePopover={() => setEditMode(false)}
							selectedApp={selectedApp}
							setSelectedAppKey={() => {}}
							gotoPrev={gotoPrev}
							gotoNext={gotoNext}
							theme={theme}
							isNewApp={isNewApp}
							forceUpdate={forceUpdate}
							randomId={randomId}
						/>
					) : null}
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

EditView.whyDidYouRender = true;
export default EditView;
