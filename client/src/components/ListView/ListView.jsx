import { Card, useMantineTheme } from "@mantine/core";
import { useClient } from "core/ClientProvider";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "../MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";

const ListView = (props) => {
	const { allApps, pageContent } = useClient();

	const theme = useMantineTheme();
	const turnPage = (page) => {
		console.log(`Turning page: ${page}`);
	};

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader theme={theme} />
				<PaginationBar />
				{pageContent && <List />}
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
