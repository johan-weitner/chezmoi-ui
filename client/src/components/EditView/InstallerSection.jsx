import { nanoid } from "nanoid";

import { Fieldset, Group, Input, SimpleGrid, Text } from "@mantine/core";
import classes from "../MainView/MainView.module.css";

const InstallerSection = (props) => {
	const { formPartTwo, register } = props;

	return (
		<Fieldset legend="Installers">
			<SimpleGrid
				cols={{ base: 1, md: 4 }}
				spacing="sm"
				mt={50}
				className={classes.grid}
			>
				{formPartTwo.map((item) => {
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
		</Fieldset>
	);
};

export default InstallerSection;
