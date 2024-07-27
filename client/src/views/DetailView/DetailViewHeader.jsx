import { Group, Text, rem } from "@mantine/core";
import { ICON } from "constants/icons";
import commonCss from "views/MainView//MainView.module.css";

const DetailViewHeader = (props) => {
	const { theme, hasSelection } = props;

	return (
		<>
			<Group className={commonCss.cardTitleContainer}>
				<ICON.detail
					style={{ width: rem(50), height: rem(50) }}
					stroke={2}
					color={theme.colors.blue[6]}
					className={commonCss.cardTitleIcon}
				/>
				<Text
					fz="lg"
					fw={500}
					className={commonCss.cardTitle}
					mt="md"
					style={{ textAlign: "left" }}
					data-testid="detailViewHeaderText"
				>
					{hasSelection ? "Detail view" : "Legend"}
				</Text>
			</Group>
		</>
	);
};

export default DetailViewHeader;
