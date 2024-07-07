import { useDisclosure } from "@mantine/hooks";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import Tagify from "@yaireo/tagify";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@yaireo/tagify/dist/tagify.css";
import {
	ActionIcon,
	Button,
	Card,
	Flex,
	Group,
	Input,
	Modal,
	SimpleGrid,
	Text,
	Textarea,
	rem,
} from "@mantine/core";
import { APP_FORM } from "constants/appForm";
import { ICON } from "constants/icons";
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";
import { useAppMutation } from "../../api/appCollectionApi";
import classes from "../MainView.module.css";
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


					{/*<ActionIcon
						size={32}
						radius="xl"
						color="#933"
						variant="filled"
						title="Close edit popover"
						onClick={() => closePopover()}
					>
						<ICON.close
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>*/}
				</Flex>
				<EditViewForm
					isPopoverOpen={isPopoverOpen}
					closePopover={closePopover}
					selectedApp={selectedApp}
					gotoPrev={() => { }}
					gotoNext={() => { }}
					theme={theme}
					isNewApp={false}
				/>

			</Card>
		</Modal>
	);
});

export default EditView;
