import { Card, Stack, useMantineTheme } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { useClientManager } from "core/ClientManager";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import StickyBox from "react-sticky-box";
import EditView from "views/EditView/EditView";
import commonCss from "views/MainView/MainView.module.css";
import DetailViewHeader from "./DetailViewHeader";
import DetailsBox from "./DetailsBox";
import Legend from "./Legend";
import { useSelector } from "store/store";

const DetailView = (props) => {
	const [currentApp, setCurrentApp] = useState(null);
	const modalRef = useRef();
	const theme = useMantineTheme();
	const selectedApp = useSelector((state) => state.root.selectedApp);
	const editMode = useSelector((state) => state.root.editMode);
	const { gotoPrev, gotoNext } = useClientManager();

	useEffect(() => {
		setCurrentApp(selectedApp);
	}, [selectedApp]);

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
