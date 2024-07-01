import { Title, Container } from "@mantine/core";
import classes from "./Header.module.css";
import logo from "./logo.svg";

const Header = (props) => {

	return (
		<Container size="md" className={classes.header}>
			<img src={logo} alt="Logo" />
			<Title>Chezmoi UI</Title>
		</Container>
	);
};

export default Header;
