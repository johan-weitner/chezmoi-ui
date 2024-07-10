import { Box, Portal, Text, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";

const DetailsBox = (props) => {
	const { pinnedAt = 100 } = props;
	const pinned = useHeadroom({ fixedAt: pinnedAt });

	return (
		<>
			<Portal>
				<Box
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						padding: "var(--mantine-spacing-xs)",
						height: rem(60),
						zIndex: 1000000,
						transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
						transition: "transform 400ms ease",
						backgroundColor: "var(--mantine-color-body)",
					}}
				>
					Pinned header
				</Box>
			</Portal>
			<Text ta="center">Header is {pinned ? "pinned" : "not pinned"}</Text>
		</>
	);
};

export default DetailsBox;
