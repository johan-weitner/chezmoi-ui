import { Group, Title, Container } from "@mantine/core";
import { useSelector } from "store/store";
import React from "react";
import GridSpinner from "./GridSpinner";
import classes from "./Header.module.css";
import Toolbar from "./Toolbar";
import logo from "./logo.svg";

const Header = (props) => {
	const { setShowAppGroupView } = props;
	const isLoading = useSelector((state) => state.root.isLoading);

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
					<Title className={classes.logoTitle} mr={10}>
						Chezmoi UI
					</Title>
					{isLoading && <GridSpinner />}
				</Group>
				<Toolbar setShowAppGroupView={setShowAppGroupView} />
			</Container>
		</Group>
	);
};

export default Header;
