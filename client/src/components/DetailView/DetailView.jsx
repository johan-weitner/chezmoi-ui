/**
 * DetailView component displays the details of an app.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.appKey - The key of the app.
 * @param {Object} props.theme - The theme object.
 * @param {boolean} props.isPopoverOpen - Indicates whether the popover is open or not.
 * @param {function} props.setIsPopoverOpen - Function to set the state of the popover.
 * @param {function} props.gotoPrev - Function to navigate to the previous app.
 * @param {function} props.gotoNext - Function to navigate to the next app.
 * @returns {JSX.Element} The rendered DetailView component.
 */
import { Card, Stack, useMantineTheme } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useClient } from "core/ClientProvider";
import FallbackComponent from "components/FallbackComponent";
import { APP_FORM } from "constants/appForm.js";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import StickyBox from "react-sticky-box";
import { deleteApp, getApp } from "../../api/appCollectionApi";
import { ICON } from "../../constants/icons";
import BarSpinner from "../BarSpinner";
import EditView from "../EditView/EditView";
import commonCss from "../MainView/MainView.module.css";
import s from "./DetailView.module.css";
import DetailViewHeader from "./DetailViewHeader";
import DetailsBox from "./DetailsBox";
import Legend from "./Legend";

const DetailView = (props) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const modalRef = useRef();
	const {
		allApps,
		totalApps,
		populateList,
		initPagination,
		editItem,
		editMode,
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

	const theme = useMantineTheme();
	const isLoading = false;
	const tags = [];
	const indicateEdit = null;
	const hasInstaller = true;

	// 	// const appTags = app?.tags && JSON.parse(app.tags);
	// 	// appTags && setTags(appTags);
	// 	const appTags = {};
	// 	const indicateEdit = false;

	const closePopover = () => {
		setSelectedApp(null);
		setIsPopoverOpen(false);
	};

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
							hasSelection={selectedApp ?? false}
						/>
						<Card
							shadow="md"
							fz="sm"
							c="dimmed"
							mt="sm"
							style={{ textAlign: "left" }}
						>
							{selectedApp ? <DetailsBox /> : <Legend />}
						</Card>
					</Card>
				</StickyBox>
			</Stack>
			{editMode && <EditView ref={modalRef} theme={theme} />}
		</ErrorBoundary>
	);
};

export default DetailView;
