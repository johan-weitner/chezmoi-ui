import { Center, Container, Group, Title } from "@mantine/core";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import React from "react";
import BarSpinner from "./BarSpinner";
import classes from "./Header.module.css";
import Toolbar from "./Toolbar";
import logo from "./logo.svg";

const Header = (props) => {
	const { gotoPrev, gotoNext, addItem } = props;
	const isFetching = useIsFetching();
	const isMutating = useIsMutating();
	// console.log("isFetching: ", isFetching);
	// console.log("isMutating: ", isMutating);
	const isLoading = isFetching > 0 || isMutating > 0;
	// console.log("isLoading: ", isLoading);

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
			{/* <div className={classes.navbar}> */}
			<Group
				justify="flex-start"
				className={classes.headerLogo}
				style={{ backgroundColor: "#121516 !important" }}
			>
				<img src={logo} alt="Logo" className={classes.logo} />
				<Title className={classes.logoTitle}>Chezmoi UI</Title>
			</Group>
			<Toolbar />

			{/* </div> */}
			{/* <div style={{ marginTop: "-10px" }}>{isLoading && <BarSpinner />}</div> */}
		</Group>
	);
};

export default Header;
