import { useState } from "react";
import {
  Flex, rem, UnstyledButton, Tooltip
} from "@mantine/core";
import {
  IconHome2,
  IconSettings,
  IconPlayerTrackNext,
  IconPlayerTrackPrev
} from '@tabler/icons-react';
import { ICON } from "constants/icons";
import { nanoid } from "nanoid";
import "@yaireo/tagify/dist/tagify.css";
import classes from "components/Header.module.css";

const Toolbar = (props) => {
  const [active, setActive] = useState(2);
  // const { menuData } = props;

  const menuData = [
    { icon: ICON.save, label: 'Save work to disk' },
    { icon: ICON.newFile, label: 'Add new app' },
    { icon: IconPlayerTrackPrev, label: 'Go to previous' },
    { icon: IconPlayerTrackNext, label: 'Go to next' },
  ];

  function NavbarLink({ icon: Icon, label, active, onClick }) {
    return (
      <Tooltip label={label} position="top" transitionProps={{ duration: 0 }}>
        <UnstyledButton onClick={onClick} data-active={active || undefined} className={resolveClassNames.toolbarIcon}>
          <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        </UnstyledButton>
      </Tooltip >
    );
  }

  const links = menuData.map((link, index) => (
    <NavbarLink
      {...link}
      key={nanoid()}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <div>
      <Flex justify="flex-start" gap={20}>
        {links}
      </Flex>
    </div>
  );

};

export default Toolbar;