import { Group, Title, Container } from "@mantine/core";
import { useEffect } from "react";
import React from "react";
import { rootStore } from "store/store";
import BarSpinner from "./BarSpinner";
import classes from "./Header.module.css";
import Toolbar from "./Toolbar";
import logo from "./logo.svg";

const Header = (props) => {
	const { setShowAppGroupView } = props;
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
			<Container size="xl">
				<Group
					justify="flex-start"
					className={classes.headerLogo}
					style={{ backgroundColor: "#121516 !important" }}
				>
					<img src={logo} alt="Logo" className={classes.logo} />
					<Title className={classes.logoTitle}>Chezmoi UI</Title>
				</Group>
				<Toolbar setShowAppGroupView={setShowAppGroupView} />
			</Container>
			<div style={{ marginTop: "80px" }}>{isLoading && <BarSpinner />}</div>
		</Group>
	);
};

export default Header;
