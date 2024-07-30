import {
	Flex,
	Group,
	Tooltip,
	Button,
	UnstyledButton,
	rem,
} from "@mantine/core";
import {
	IconDownload,
	IconPlayerTrackNext,
	IconPlayerTrackPrev,
} from "@tabler/icons-react";
import { ICON } from "constants/icons";
import { nanoid } from "nanoid";
import { useState } from "react";
import classes from "components/Toolbar.module.css";
import { useClientManager } from "core/ClientManager";
import BarSpinner from "./BarSpinner";

const Toolbar = (props) => {
	const { setShowAppGroupView } = props;
	const [active, setActive] = useState(null);
	const { isLoading, addItem, deleteItem, gotoPrev, gotoNext, downloadYaml } =
		useClientManager();
	const stroke = 1.5;

	const menuData = [
		{
			Icon: (
				<ICON.add style={{ width: rem(20), height: rem(20) }} stroke={stroke} />
			),
			label: "Applications",
			action: () => setShowAppGroupView(false),
		},
		{
			Icon: (
				<ICON.remove
					style={{ width: rem(20), height: rem(20) }}
					stroke={stroke}
				/>
			),
			label: "Application Groups",
			action: () => setShowAppGroupView(true),
		},
	];

	const onClick = (action) => {
		typeof action === "function" && action();
	};

	const NavbarLink = ({ Icon, label, active, action, link }) => {
		return (
			<Button
				onClick={() => onClick(action)}
				className={classes.navbarLink}
				size="sm"
				data-active={active || null}
				link={link}
				variant="light"
			>
				{label}
			</Button>
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
