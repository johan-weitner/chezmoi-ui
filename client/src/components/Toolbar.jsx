import {
	Flex,
	Group,
	Title,
	Tooltip,
	UnstyledButton,
	rem,
} from "@mantine/core";
import {
	IconHome2,
	IconPlayerTrackNext,
	IconPlayerTrackPrev,
	IconSettings,
} from "@tabler/icons-react";
import { ICON } from "constants/icons";
import { nanoid } from "nanoid";
import { useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import classes from "components/Toolbar.module.css";
import logo from "./logo.svg";

const Toolbar = (props) => {
	const [active, setActive] = useState();
	const { gotoPrev, gotoNext, addItem } = props;

	const btnStyle = { width: rem(20), height: rem(20) };
	const stroke = 1.5;

	const menuData = [
		{
			Icon: <ICON.add style={btnStyle} stroke={stroke} />,
			label: "Add new app",
			action: () => {
				addItem();
			},
		},
		{
			Icon: <IconPlayerTrackPrev style={btnStyle} stroke={stroke} />,
			label: "Go to previous",
			action: () => {
				gotoPrev();
			},
		},
		{
			Icon: <IconPlayerTrackNext style={btnStyle} stroke={stroke} />,
			label: "Go to next",
			action: () => {
				gotoNext();
			},
		},
	];

	const onClick = (action) => {
		typeof action === "function" && action();
	};

	function NavbarLink({ Icon, label, active, action }) {
		return (
			<Tooltip
				label={label}
				position="bottom"
				transitionProps={{ duration: 0 }}
			>
				<UnstyledButton
					onClick={() => onClick(action)}
					className={classes.link}
					data-active={active || null}
				>
					{Icon}
				</UnstyledButton>
			</Tooltip>
		);
	}

	const links = menuData.map((link, index) => (
		<NavbarLink
			{...link}
			key={nanoid()}
			active={index === active}
			onClick={() => setActive(index)}
		/>
	));

	return (
		<nav className={classes.navbar}>
			<Group justify="flex-start" className={classes.navbarMain}>
				<Flex justify="flex-start" gap={10}>
					{links}
				</Flex>
			</Group>

			<Flex justify="flex-start" gap={20}>
				<NavbarLink icon={IconHome2} label="Change account" />
				<NavbarLink icon={IconSettings} label="Logout" />
			</Flex>
		</nav>
	);
};

export default Toolbar;
