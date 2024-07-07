import { useDisclosure } from "@mantine/hooks";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Group,
  Input,
  SimpleGrid,
  Text,
  Textarea
} from "@mantine/core";
import { APP_FORM } from "constants/appForm";
import { ICON } from "constants/icons";

import { useAppMutation } from "../../api/appCollectionApi";
import classes from "../MainView.module.css";
import InfoSection from "./InfoSection";
import TagSection from "./TagSection";


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