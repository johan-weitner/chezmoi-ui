import { Box, Button, Container, Group } from "@mantine/core";
import { ICON } from "constants/icons.js";
import classes from "./MainHeader.module.css";
import Toolbar from "../Toolbar";

const MainHeader = (props) => {
	const { save } = props;

	const links = [
		{ icon: <ICON.save />, label: "Save", action: save },
		{
			icon: <ICON.download />,
			label: "Download YAML",
			action: () => {
				window.open("http://localhost:3000/rawlist", "_blank");
			},
		},
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
			<Container className={classes.inner} style={{ margin: "0", height: "50px" }}>
				<Box className={classes.links} visibleFrom="sm">
					<Group gap={0} justify="flex-end" className={classes.mainLinks}>
						{/* {mainItems} */}
						<Toolbar />
					</Group>
				</Box>
			</Container>
		</header>
	);
};

export default MainHeader;
