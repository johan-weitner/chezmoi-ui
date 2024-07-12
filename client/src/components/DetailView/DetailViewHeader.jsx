import { ActionIcon, Text, rem } from "@mantine/core";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { ICON } from "../../constants/icons";

const DetailViewHeader = (props) => {
	const { theme, isPopoverOpen, gotoPrev, gotoNext } = props;

	return (
		<>
			<ICON.detail
				style={{ width: rem(50), height: rem(50) }}
				stroke={2}
				color={theme.colors.blue[6]}
			/>
			{/* <Text
				fz="lg"
				fw={500}
				className={classes.cardTitle}
				mt="md"
				style={{ textAlign: "left" }}
			>
				Detail view - popOverOpen: {isPopoverOpen.toString()}
			</Text> */}
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
