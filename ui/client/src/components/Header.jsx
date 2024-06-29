import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from "./Header.module.css";
import logo from "./logo.svg";

const Header = (props) => {
	const { alternatives, switchOs } = props;
	const [opened, { toggle }] = useDisclosure(false);
	const [active, setActive] = useState(alternatives[0]);

	const links = alternatives.map((item) => {
		return { link: "#", label: item };
	});

	const switchTab = (e, os) => {
		// console.log(os);
		setActive(os);
		switchOs(os);
	};

	const items = links?.map((link) => (
		<button
			type="button"
			key={link.label}
			className={classes.link}
			data-active={active === link.label || undefined}
			style={{ textTransform: "capitalize" }}
			onClick={(e) => {
				e.preventDefault();
				switchTab(e, link.label);
			}}
		>
			{link.label}
		</button>
	));

	return (
		alternatives &&
		links &&
		items && (
			<header className={classes.header} style={{ marginBottom: "30px" }}>
				<Container size="md" className={classes.inner}>
					{/* insert SVG named "logo" */}
					<img
						src={logo}
						alt="Logo"
						style={{ position: "absolute", left: "32px" }}
					/>
					<h1
						style={{
							display: "inlineBlock",
							fontFamily: "Roboto",
							fontWeight: "normal",
						}}
					>
						Chezmoi UI
					</h1>
					{/* <Group gap={5} visibleFrom="xs">
          {items}
        </Group> */}
					<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
				</Container>
			</header>
		)
	);
};

export default Header;
