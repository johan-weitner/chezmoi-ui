import { useDisclosure } from "@mantine/hooks";
import { IconPlayerTrackNext, IconPlayerTrackPrev } from "@tabler/icons-react";
import Tagify from "@yaireo/tagify";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@yaireo/tagify/dist/tagify.css";
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
import { TAGS_WHITE_LIST } from "constants/tagsWhiteList";
import { useAppMutation } from "../../api/appCollectionApi";
import classes from "../MainView.module.css";

const InfoSection = props => {
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