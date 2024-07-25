import { useEffect } from "react";
import { Group, Title } from "@mantine/core";
import React from "react";
import { rootStore } from "../store/store";
import BarSpinner from "./BarSpinner";
import classes from "./Header.module.css";
import Toolbar from "./Toolbar";
import logo from "./logo.svg";

const Header = (props) => {
	const [isLoading, setIsLoading] = React.useState(false);
	useEffect(() => {
		setIsLoading(rootStore.get.isLoading());
	}, [rootStore.use.isLoading()]);

	return (
		<Group
			justify="flex-start"
			align="center"
			className={classes.innerContainer}
			px={0}
			py={0}
			m={0}
			style={{ height: "100px" }}
		>
			<div className={classes.navbar}>
				<Group
					justify="flex-start"
					className={classes.headerLogo}
					style={{ backgroundColor: "#121516 !important" }}
				>
					<img src={logo} alt="Logo" className={classes.logo} />
					<Title className={classes.logoTitle}>Chezmoi UI</Title>
				</Group>
				<Toolbar />
			</div>
			<div style={{ marginTop: "80px" }}>{isLoading && <BarSpinner />}</div>
		</Group>
	);
};

export default Header;
