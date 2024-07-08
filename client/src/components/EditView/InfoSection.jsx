import { nanoid } from "nanoid";
import "@yaireo/tagify/dist/tagify.css";
import { Group, Input, SimpleGrid, Text, Textarea } from "@mantine/core";
import classes from "../MainView/MainView.module.css";

const InfoSection = (props) => {
	const { formPartOne, register } = props;

	return (
		<>
			<h3
				style={{
					textAlign: "left",
					fontSize: "1.8em",
					fontWeight: "normal",
					marginTop: "0",
				}}
			>
				Info
			</h3>
			<SimpleGrid
				cols={{ base: 1, md: 2 }}
				spacing="sm"
				mt={50}
				className={classes.grid}
				style={{ marginBottom: "-20px" }}
			>
				{formPartOne.map((item) => {
					return (
						<Group
							display="block"
							className={classes.fieldcontainer}
							key={nanoid()}
						>
							<Text component="label" htmlFor={item.name} size="sm" fw={500}>
								{item.label}
							</Text>
							<Input id={item.name} {...register(item.name)} />
						</Group>
					);
				})}
			</SimpleGrid>
			<SimpleGrid
				cols={{ base: 1, md: 1 }}
				spacing="sm"
				mt={50}
				className={classes.grid}
				style={{ marginBottom: "0", marginTop: "-20px", paddingTop: "0" }}
			>
				<Group display="block" className={classes.fieldcontainer}>
					<Text component="label" htmlFor="_desc" size="sm" fw={500}>
						Description
					</Text>
					<Textarea id="_desc" rows="8" {...register("_desc")} />
				</Group>
			</SimpleGrid>
		</>
	);
};

export default InfoSection;
