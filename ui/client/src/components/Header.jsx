import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import logo from "./logo.svg";

const Header = (props) => {
	const [opened, { toggle }] = useDisclosure(false);

	return (
		<header className={classes.header} style={{ marginBottom: "30px" }}>
			<Container size="md" className={classes.inner}>
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
			</Container>
		</header>
	);
};

export default Header;
