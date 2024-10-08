import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import { Card, Modal } from "@mantine/core";
import { randomId, useForceUpdate } from "@mantine/hooks";
import FallbackComponent from "components/FallbackComponent";
import { useClientManager } from "core/ClientManager";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";
import "../../App.css";
import { setEditMode } from "store/store";

const EditView = forwardRef(function EditView(props, ref) {
	const dispatch = useDispatch();
	const { theme } = props;
	const { setIsEditMode, gotoPrev, gotoNext } = useClientManager();
	const editMode = useSelector((state) => state.root.editMode);
	const selectedApp = useSelector((state) => state.root.selectedApp);
	const [isNewApp, setIsNewApp] = useState(!selectedApp); // FIXME
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setIsNewApp(!selectedApp);
	}, [selectedApp]);

	return (
		<Modal
			opened={editMode}
			keepMounted={false}
			onClose={() => setIsEditMode(false)}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="auto"
			shadow="xl"
			transitionProps={{ transition: "pop", duration: 200 }}
		>
			<Card style={{ backgroundColor: "#222" }}>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
					style={{ margin: "0 !important" }}
				>
					<EditViewForm />
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

// EditView.whyDidYouRender = true;
export default EditView;
