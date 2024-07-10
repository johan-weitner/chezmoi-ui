import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Group,
	Text,
	rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
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
import { MarkPopulated, MarkUnPopulated, WarningSign } from "../Indicator";
import classes from "../MainView/MainView.module.css";
import s from "./DetailView.module.css";
import DetailsBox from "./DetailsBox";
import Legend from "./Legend";

// FIXME: Refactor into smaller sub - components
const DetailView = (props) => {
	const { appKey, theme, isPopoverOpen, setIsPopoverOpen, gotoPrev, gotoNext } =
		props;
	const [selectedApp, setSelectedApp] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [tags, setTags] = useState(null);
	const [hasInstaller, setHasInstaller] = useState(false);
	const [scroll, scrollTo] = useWindowScroll();
	const modalRef = useRef();
	const itemBox = useRef();
	let indicateEdit;

	useEffect(() => {
		if (!appKey) {
			setSelectedApp(null);
			return;
		}
		getApp(appKey).then((result) => {
			setIsLoading(false);
			const app = result?.JSON && JSON.parse(result.JSON);
			setSelectedApp(app);
			APP_FORM.formPartTwo.map((item) => {
				if (app[item.name] && app[item.name].length > 0) {
					setHasInstaller(true);
					return;
				}
			});

			const appTags = app?.tags && JSON.parse(app.tags);
			appTags && setTags(appTags);

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
				<Card shadow="md" radius="md" className={classes.card} padding="xl">
					<ICON.detail
						style={{ width: rem(50), height: rem(50) }}
						stroke={2}
						color={theme.colors.blue[6]}
					/>
					<Text
						fz="lg"
						fw={500}
						className={classes.cardTitle}
						mt="md"
						style={{ textAlign: "left" }}
					>
						Detail view - popOverOpen: {isPopoverOpen.toString()}
					</Text>
					<ActionIcon
						size={32}
						radius="xl"
						color={theme.primaryColor}
						variant="filled"
						title="Go to previous app"
						onClick={() => gotoPrev()}
						style={{
							position: "absolute",
							right: "90px",
							top: "130px",
							zIndex: "10",
						}}
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
						style={{
							position: "absolute",
							right: "50px",
							top: "130px",
							zIndex: "10",
						}}
					>
						<IconPlayerTrackNext
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
							color="white"
						/>
					</ActionIcon>
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
						<Text size="sm">
							Scroll: {scroll.x}, {scroll.y}
						</Text>
					</Card>
				</Card>
			</Sticky>
			{isPopoverOpen && (
				<EditView
					ref={modalRef}
					isPopoverOpen={isPopoverOpen}
					closePopover={closePopover}
					selectedApp={selectedApp}
					theme={theme}
				/>
			)}
		</ErrorBoundary>
	);
};

export default DetailView;
