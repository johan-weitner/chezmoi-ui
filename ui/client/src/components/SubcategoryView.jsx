import { Card, Text, rem } from "@mantine/core";
import { nanoid } from "nanoid";
import react from "react";
import classes from "./FeatureCards.module.css";

// Chosen view/subcategory
const SubcategoryView = (props) => {
	const { subCategory, theme } = props;

	return (
		<Card shadow="md" radius="md" className={classes.card} padding="xl">
			<subCategory.icon
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
				{subCategory.title}
			</Text>
			<Card fz="sm" c="dimmed" mt="sm" style={{ textAlign: "left" }}>
				{subCategory?.listItems?.length > 0 &&
					subCategory.listItems.map((item) => {
						return (
							<div key={nanoid()} className={classes.itemBox}>
								{typeof item === "string" ? item : item.name}
							</div>
						);
					})}
			</Card>
		</Card>
	);
};

export default SubcategoryView;
