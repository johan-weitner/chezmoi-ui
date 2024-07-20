import { Group, Text, rem, useMantineTheme } from "@mantine/core";
import { ICON } from "constants/icons";
import commonCss from "views/MainView/MainView.module.css";
// import SearchWidget from "./SearchWidget";
// import css from "./ListView.module.css";

export const ListViewHeader = (props) => {
	const theme = useMantineTheme();

	return (
		<>
			<Group className={commonCss.cardTitleContainer}>
				<ICON.allApps
					style={{ width: rem(50), height: rem(50) }}
					stroke={2}
					color={theme.colors.blue[6]}
					className={commonCss.cardTitleIcon}
				/>
				<Text fz="xl" fw={500} className={commonCss.cardTitle} mt="md">
					Applications
				</Text>
			</Group>
		</>
	);
};
