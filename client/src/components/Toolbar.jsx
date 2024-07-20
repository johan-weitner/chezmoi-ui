import { Flex, Group, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { ICON } from "constants/icons";
import { nanoid } from "nanoid";
import { useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import { useClientManager } from "core/ClientManager";
import classes from "components/Toolbar.module.css";
import BarSpinner from "./BarSpinner";

const Toolbar = (props) => {
	const [active, setActive] = useState(null);
	const { isLoading, editItem, deleteItem, gotoPrev, gotoNext } =
		useClientManager();
	const stroke = 1.5;

	const menuData = [
		{
			Icon: (
				<ICON.add style={{ width: rem(20), height: rem(20) }} stroke={stroke} />
			),
			label: "Add new app",
			action: editItem,
		},
		{
			Icon: (
				<ICON.remove
					style={{ width: rem(20), height: rem(20) }}
					stroke={stroke}
				/>
			),
			label: "Delete app",
			action: deleteItem,
		},
		{
			Icon: (
				<IconPlayerTrackPrev
					style={{ width: rem(20), height: rem(20) }}
					stroke={stroke}
				/>
			),
			label: "Go to previous",
			action: gotoPrev,
		},
		{
			Icon: (
				<IconPlayerTrackNext
					style={{ width: rem(20), height: rem(20) }}
					stroke={stroke}
				/>
			),
			label: "Go to next",
			action: gotoNext,
		},
	];

	const onClick = (action) => {
		typeof action === "function" && action();
	};

	const NavbarLink = ({ Icon, label, active, action }) => {
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
	};

	return (
		<nav className={classes.navbar}>
			<Group justify="flex-start" className={classes.navbarMain}>
				<Flex justify="flex-start" gap={10}>
					{menuData.map((menuItem, index) => {
						return (
							<NavbarLink
								{...menuItem}
								key={nanoid()}
								onClick={() => setActive(index)}
							/>
						);
					})}
				</Flex>
			</Group>
			{isLoading && <BarSpinner />}
		</nav>
	);
};

export default Toolbar;
