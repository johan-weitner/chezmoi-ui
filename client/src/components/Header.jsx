import { Title, Container } from "@mantine/core";
import classes from "./Header.module.css";
import logo from "./logo.svg";

/**
 * Renders the header component for the application.
 *
 * The header includes the application logo and title, and is contained within a centered container.
 *
 * @param {object} props - The props passed to the header component.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = (props) => {

	return (
		<Container size="md" className={classes.header}>
			<img src={logo} alt="Logo" />
			<Title>Chezmoi UI</Title>
		</Container>
	);
};

export default Header;
