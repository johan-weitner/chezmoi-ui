import { Box, Button, Container, Group } from "@mantine/core";
import { ICON } from "../constants/icons.js";
import classes from "./MainHeader.module.css";

/**
 * Renders the main header component for the application.
 *
 * The main header includes a set of buttons for saving the current state, downloading the YAML data, and potentially other actions.
 *
 * @param {Object} props - The component props.
 * @param {function} props.save - A function to call when the "Save" button is clicked.
 * @param {function} props.startOver - A function to call when the "Start Over" button is clicked.
 * @returns {JSX.Element} The rendered main header component.
 */
const MainHeader = (props) => {
	const { save, startOver } = props;

	const links = [
		{ icon: <ICON.save />, label: "Save", action: save },
		{ icon: <ICON.download />, label: "Download YAML", action: () => { window.open('http://localhost:3000/rawlist', '_blank') } },
	];

	const mainItems = links.map((item) => (
		<Button
			href={item.link}
			key={item.label}
			className={classes.mainLink}
			leftSection={item.icon}
			variant="transparent"
			onClick={(event) => {
				event.preventDefault();
				typeof item.action === "function" && item.action();
			}}
		>
			{item.label}
		</Button>
	));

	return (
		<header className={classes.header}>
			<Container className={classes.inner} style={{ margin: "0" }}>
				<Box className={classes.links} visibleFrom="sm">
					<Group gap={0} justify="flex-end" className={classes.mainLinks}>
						{mainItems}
					</Group>
				</Box>
			</Container>
		</header>
	);
};

export default MainHeader;
