import { nanoid } from "nanoid";
import { forwardRef } from "react";
import { useFocusTrap } from "@mantine/hooks";
import "@yaireo/tagify/dist/tagify.css";
import {
	Fieldset,
	Group,
	Input,
	SimpleGrid,
	Text,
	Textarea,
} from "@mantine/core";
import classes from "../MainView/MainView.module.css";

const InfoSection = (props) => {
	const { formPartOne, register } = props;
	const focusTrapRef = useFocusTrap();

	return (
		<div>
			<Fieldset legend="Info" style={{ paddingTop: "0 !important" }}>
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="xs"
					mt={0}
					className={classes.grid}
					style={{ marginBottom: "-20px", backgroundColor: "#222 !important" }}
				>
					{formPartOne.map((item) => {
						return (
							<Group
								display="block"
								className={classes.fieldcontainer}
								key={nanoid()}
								gap="xs"
								style={{ backgroundColor: "#222 !important" }}
							>
								<Text component="label" htmlFor={item.name} size="sm" fw={500}>
									{item.label}
								</Text>
								<Input
									id={item.name}
									{...register(item.name)}
									ref={item.trapFocus && focusTrapRef}
								/>
							</Group>
						);
					})}
				</SimpleGrid>
				<SimpleGrid
					cols={{ base: 1, md: 1 }}
					spacing="sm"
					mt={30}
					className={classes.grid}
					style={{ marginBottom: "0", marginTop: "-20px", paddingTop: "0" }}
				>
					<Group display="block" className={classes.fieldcontainer} gap="xs">
						<Text component="label" htmlFor="desc" size="sm" fw={500}>
							Description
						</Text>
						<Textarea id="desc" rows="8" {...register("desc")} />
					</Group>
				</SimpleGrid>
			</Fieldset>
		</div>
	);
};

export default InfoSection;
