import { Container, Group, Title } from "@mantine/core";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import React from "react";
import { useLoading } from "../api/appCollectionApi";
import BarSpinner from "./BarSpinner";
import classes from "./Header.module.css";
import Toolbar from "./Toolbar";
import logo from "./logo.svg";

const Header = (props) => {
	const isFetching = useIsFetching();
	const isMutating = useIsMutating();
	// console.log("isFetching: ", isFetching);
	// console.log("isMutating: ", isMutating);
	const isLoading = isFetching > 0 || isMutating > 0;
	// console.log("isLoading: ", isLoading);

	return (
		<>
			<Container size="lg" className={classes.header} px={0} py={0} m={0}>
				{/* <nav className={classes.navbar}> */}
				<Group justify="flex-start" className={classes.navbarLogo}>
					<img src={logo} alt="Logo" className={classes.logo} />
					<Title className={classes.logoTitle}>Chezmoi UI</Title>
				</Group>
				<Toolbar />
				{/* </nav> */}
				{/* <div style={{ marginTop: "-10px" }}>{isLoading && <BarSpinner />}</div> */}
			</Container>
		</>
	);
};

export default Header;
