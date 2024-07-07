import { useEffect } from "react";
import { Container, Title, Group } from "@mantine/core";
import classes from "./Header.module.css";
import logo from "./logo.svg";
import BarSpinner from "./BarSpinner";
import { useLoading } from "../api/appCollectionApi";
import React from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import Toolbar from './Toolbar'

const Header = (props) => {
	const isFetching = useIsFetching();
	const isMutating = useIsMutating();
	const isLoading = isFetching > 0 || isMutating > 0;

	return (
		<>
			<Container size="lg" className={classes.header}>
				{/* <Toolbar /> */}
				<nav className={classes.navbar}>
					<Group justify="flex-start" className={classes.navbarLogo}>
						<img src={logo} alt="Logo" />
						<Title>Chezmoi UI</Title>
					</Group>
				</nav>
				{isLoading && <BarSpinner />}
			</Container>

		</>
	);
};

export default Header;
