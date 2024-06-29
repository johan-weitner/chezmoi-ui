import { Card, Text, rem } from "@mantine/core";
import { nanoid } from "nanoid";
import react from "react";
import { ICON } from "../constants/icons";
import classes from "./FeatureCards.module.css";

const AllAppsView = (props) => {
	const { allApps, theme } = props;

	// All apps through all subcategories
	return (
		<Card shadow="md" radius="md" className={classes.card} padding="xl">
			<ICON.allApps
				style={{ width: rem(50), height: rem(50) }}
				stroke={2}
				color={theme.colors.blue[6]}
			/>
			<Text
				fz="lg"
				fw={500}
				className={classes.cardTitle}
				mt="md"
				style={{ textAlign: "left" }}
			>
				All apps
			</Text>
			<Card fz="sm" c="dimmed" mt="sm" style={{ textAlign: "left" }}>
				{allApps?.length > 0 &&
					allApps.map((item) => {
						return (
							<div key={nanoid()} className={classes.itemBox}>
								{item}
							</div>
						);
					})}
			</Card>
		</Card>
	);
};

export default AllAppsView;
