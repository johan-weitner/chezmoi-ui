/**
 * DetailView component displays the details of an app.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.selectedAppKey - The key of the app.
 * @param {Object} props.theme - The theme object.
 * @param {boolean} props.isPopoverOpen - Indicates whether the popover is open or not.
 * @param {function} props.setIsPopoverOpen - Function to set the state of the popover.
 * @param {function} props.gotoPrev - Function to navigate to the previous app.
 * @param {function} props.gotoNext - Function to navigate to the next app.
 * @returns {JSX.Element} The rendered DetailView component.
 */
import { Card, Stack, useMantineTheme, Text } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import StickyBox from "react-sticky-box";
// import EditView from "views/EditView/EditView";
import commonCss from "views/MainView/MainView.module.css";
import DetailViewHeader from "./DetailViewHeader";
import DetailsBox from "./DetailsBox";
import EditView from "views/EditView/EditView";
import Legend from "./Legend";
import { memoizedSelectApp } from "core/Selectors";
import { useClientManager } from "core/ClientManager";
import { rootStore } from "store/store";

const DetailView = (props) => {
	const [currentApp, setCurrentApp] = useState(null);
	const [editMode, setEditMode] = useState(null);
	const modalRef = useRef();
	const theme = useMantineTheme();

	const { gotoPrev, gotoNext } = useClientManager();

	useEffect(() => {
		setCurrentApp(rootStore.get.selectedApp());
	}, [rootStore.use.selectedApp()]);

	useEffect(() => {
		setEditMode(rootStore.get.editMode());
	}, [rootStore.use.editMode()]);

	// 	// const appTags = app?.tags && JSON.parse(app.tags);
	// 	// appTags && setTags(appTags);
	// 	const appTags = {};
	// 	const indicateEdit = false;

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Stack>
				<StickyBox offsetTop={105} offsetBottom={0}>
					<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
						<DetailViewHeader
							gotoPrev={gotoPrev}
							gotoNext={gotoNext}
							theme={theme}
							hasSelection={currentApp ?? false}
						/>
						<Card
							shadow="md"
							fz="sm"
							c="dimmed"
							mt="sm"
							style={{ textAlign: "left" }}
						>
							{currentApp ? (
								<DetailsBox selectedApp={currentApp} />
							) : (
								<Legend />
							)}
						</Card>
					</Card>
				</StickyBox>
			</Stack>
			{editMode && <EditView ref={modalRef} theme={theme} />}
		</ErrorBoundary>
	);
};

export default DetailView;
