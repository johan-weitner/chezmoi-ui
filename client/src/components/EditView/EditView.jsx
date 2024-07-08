import { forwardRef, useEffect } from "react";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import "@yaireo/tagify/dist/tagify.css";
import { ActionIcon, Card, Flex, Modal, rem } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import EditViewForm from "./EditViewForm";

const EditView = forwardRef(function EditView(props, ref) {
	const {
		isPopoverOpen,
		closePopover,
		selectedApp,
		gotoPrev,
		gotoNext,
		theme,
		isNewApp,
	} = props;

	return (
		<Modal
			opened={isPopoverOpen}
			keepMounted
			onClose={closePopover}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 7,
			}}
			radius="10"
			size="xl"
		>
			<Card>
				<Flex justify="flex-end" gap={"sm"}>
					<>
						<ActionIcon
							size={32}
							radius="xl"
							color={theme.primaryColor}
							variant="filled"
							title="Go to previous app"
							onClick={() => gotoPrev()}
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
						>
							<IconPlayerTrackNext
								style={{ width: rem(18), height: rem(18) }}
								stroke={1.5}
								color="white"
							/>
						</ActionIcon>
					</>
				</Flex>
				<ErrorBoundary
					fallbackRender={(error) => (
						<FallbackComponent error={error.message} />
					)}
				>
					<EditViewForm
						isPopoverOpen={isPopoverOpen}
						closePopover={closePopover}
						selectedApp={selectedApp}
						gotoPrev={() => { }}
						gotoNext={() => { }}
						theme={theme}
						isNewApp={false}
					/>
				</ErrorBoundary>
			</Card>
		</Modal>
	);
});

export default EditView;
