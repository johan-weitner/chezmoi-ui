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
import { rootStore, MAIN_VIEWS } from "../store/store";

const Toolbar = (props) => {
	const { setShowAppGroupView } = props;
	const [active, setActive] = useState(null);
	const { isLoading, addItem, deleteItem, gotoPrev, gotoNext, downloadYaml } =
		useClientManager();
	const stroke = 1.5;

	const openAppsView = () => {
		rootStore.set.mainView(MAIN_VIEWS[0]);
		setShowAppGroupView(false);
	};

	const openGroupsView = () => {
		rootStore.set.mainView(MAIN_VIEWS[1]);
		setShowAppGroupView(true);
	};

	const menuData = [
		{
			Icon: (
				<ICON.add style={{ width: rem(20), height: rem(20) }} stroke={stroke} />
			),
			label: "Applications",
			mainViewKey: MAIN_VIEWS[0],
			action: () => openAppsView(),
		},
		{
			Icon: (
				<ICON.remove
					style={{ width: rem(20), height: rem(20) }}
					stroke={stroke}
				/>
			),
			label: "Application Groups",
			mainViewKey: MAIN_VIEWS[1],
			action: () => openGroupsView(),
		},
	];

	const onClick = (action) => {
		typeof action === "function" && action();
	};

	const NavbarLink = ({ Icon, label, active, action, link, className }) => {
		return (
			<Button
				onClick={() => onClick(action)}
				size="sm"
				data-active={active || null}
				link={link}
				variant="light"
				className={className}
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
								className={
									rootStore.get.mainView() === menuItem.mainViewKey
										? classes.navbarLinkActive
										: classes.navbarLink
								}
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
