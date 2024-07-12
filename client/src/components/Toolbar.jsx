import {
	Flex,
	Group,
	Text,
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
	const {
		gotoPrev,
		gotoNext = null,
		addItem = null,
		deleteItem = null,
		position = "top",
	} = props;

	const btnStyle = { width: rem(20), height: rem(20) };
	const stroke = 1.5;

	const menuData = [
		{
			Icon: <ICON.add style={btnStyle} stroke={stroke} />,
			label: "Add new app",
			action: () => {
				addItem();
			},
			position: ["top", "leftcol"],
		},
		{
			Icon: <ICON.remove style={btnStyle} stroke={stroke} />,
			label: "Delete app",
			action: () => {
				deleteItem();
			},
			position: ["top", "leftcol"],
		},
		{
			Icon: <IconPlayerTrackPrev style={btnStyle} stroke={stroke} />,
			label: "Go to previous",
			action: () => {
				gotoPrev();
			},
			position: ["top"],
		},
		{
			Icon: <IconPlayerTrackNext style={btnStyle} stroke={stroke} />,
			label: "Go to next",
			action: () => {
				gotoNext();
			},
			position: ["top"],
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

	const links = menuData.map((menuItem, index) => {
		if (menuItem.position.includes(position)) {
			return (
				<NavbarLink
					{...menuItem}
					key={nanoid()}
					active={index === active}
					onClick={() => setActive(index)}
				/>
			);
		}
	});

	return (
		<nav className={classes.navbar}>
			<Group justify="flex-start" className={classes.navbarMain}>
				<Flex justify="flex-start" gap={10}>
					{links}
				</Flex>
			</Group>
		</nav>
	);
};

export default Toolbar;
