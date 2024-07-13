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
import { Card, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import FallbackComponent from "components/FallbackComponent";
import { APP_FORM } from "constants/appForm.js";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Sticky from "react-sticky-el";
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
	const {
		appKey,
		setSelectedAppKey,
		theme,
		isPopoverOpen,
		setIsPopoverOpen,
		gotoPrev,
		gotoNext,
	} = props;
	const [selectedApp, setSelectedApp] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [tags, setTags] = useState(null);
	const [hasInstaller, setHasInstaller] = useState(false);
	const [scroll, scrollTo] = useWindowScroll();
	const modalRef = useRef();
	let indicateEdit;

	useEffect(() => {
		if (!appKey) {
			console.log("No selected app - showing legend");
			setSelectedApp(null);
			return;
		}
		console.log("Selected app - fetching app with key: ", appKey);
		getApp(appKey).then((app) => {
			setSelectedApp(app);
			APP_FORM.formPartTwo.map((item) => {
				if (app[item.name] && app[item.name].length > 0) {
					setHasInstaller(true);
					return;
				}
			});

			const appTags = app?.tags && JSON.parse(app.tags);
			appTags && setTags(appTags);
			console.log("Got app tags: ", appTags);

			indicateEdit = app.edited ? (
				<ICON.check
					style={{
						width: rem(20),
						height: rem(20),
						position: "absolute",
						right: "50px",
						top: "45px",
						zIndex: "999999",
					}}
					stroke={2}
					color="green"
					title="Has been edited"
				/>
			) : null;
		});
	}, [appKey]);

	const edit = () => {
		setIsPopoverOpen(true);
	};

	const removeApp = (key) => {
		deleteApp(key)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.error(error);
			});

		console.log("Deleting app with key: ", key);
		const queryClient = new QueryClient();
		axios
			.delete(`/api/deleteNode?key=${key}`, {
				key: key,
			})
			.then((result) => {
				console.log(result);
				queryClient.cancelQueries(["appCollection"]);
				const previousData = queryClient.getQueryData(["appCollection"]);

				queryClient.setQueryData(["appCollection"], (old) => {
					return old?.filter((item) => item.key !== key);
				});
				return { previousData };
			})
			.catch((error) => console.error(error));
	};

	const closePopover = () => {
		setSelectedApp(null);
		setIsPopoverOpen(false);
	};

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Sticky stickyClassName={s.sticky}>
				<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
					<DetailViewHeader
						theme={theme}
						isPopoverOpen={isPopoverOpen}
						gotoPrev={gotoPrev}
						gotoNext={gotoNext}
						hasSelection={selectedApp ?? false}
					/>
					<Card
						shadow="md"
						fz="sm"
						c="dimmed"
						mt="sm"
						style={{ textAlign: "left" }}
					>
						{selectedApp ? (
							<DetailsBox
								selectedApp={selectedApp}
								isLoading={isLoading}
								tags={tags}
								hasInstaller={hasInstaller}
								indicateEdit={indicateEdit}
								edit={edit}
								removeApp={removeApp}
								closePopover={closePopover}
								scroll={scroll}
								theme={theme}
							/>
						) : (
							<Legend />
						)}
					</Card>
				</Card>
			</Sticky>
			{isPopoverOpen && (
				<EditView
					ref={modalRef}
					isPopoverOpen={isPopoverOpen}
					closePopover={closePopover}
					selectedApp={selectedApp}
					setSelectedAppKey={setSelectedAppKey}
					theme={theme}
				/>
			)}
		</ErrorBoundary>
	);
};

export default DetailView;
