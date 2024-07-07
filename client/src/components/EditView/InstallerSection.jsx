import { nanoid } from "nanoid";

import {
  Group,
  Input,
  SimpleGrid,
  Text
} from "@mantine/core";
import classes from "../MainView/MainView.module.css";

const InstallerSection = props => {
  const { formPartTwo, register } = props;

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
        Installers
      </h3>
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
              <Text
                component="label"
                htmlFor={item.name}
                size="sm"
                fw={500}
              >
                {item.label}
              </Text>
              <Input id={item.name} {...register(item.name)} />
            </Group>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default InstallerSection;