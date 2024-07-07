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
import InstallerSection from "./InstallerSection";

const EditViewForm = (props, ref) => {
  const {
    closePopover,
    selectedApp,
    theme,
    isNewApp,
  } = props;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: isNewApp ? null : selectedApp,
  });

  const [opened, { open, close }] = useDisclosure(true);

  useEffect(() => {
    reset(selectedApp);
  }, [selectedApp, isNewApp, reset]);

  const { formPartOne, formPartTwo } = APP_FORM;

  const updateApp = useAppMutation();
  const onSubmit = async (data) => {
    console.log('updateApp', updateApp);
    await updateApp.mutate(data);
    closePopover();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={classes.editDetailHeader}>
        {selectedApp?._name || "New application"}
      </h2>

      <InfoSection formPartOne={formPartOne} register={register} />
      <TagSection register={register} appKey={selectedApp.key} />
      <InstallerSection formPartTwo={formPartTwo} register={register} />

      <Group justify="center">
        <Button
          onClick={() => closePopover()}
          className={classes.cancelBtn}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={classes.saveBtn}
          leftSection={<ICON.save />}
        >
          Save
        </Button>
      </Group>
    </form>
  )
};

export default EditViewForm;