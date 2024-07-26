import { ActionIcon, Group, Text, rem } from "@mantine/core";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { ICON } from "constants/icons";
import commonCss from "views/MainView//MainView.module.css";
import css from "./DetailView.module.css";

const DetailViewHeader = (props) => {
	const { theme, isPopoverOpen, gotoPrev, gotoNext, hasSelection } = props;

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
				>
					{hasSelection ? "Detail view" : "Legend"}
				</Text>
			</Group>
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
		</>
	);
};

export default DetailViewHeader;
