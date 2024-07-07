import { useState } from "react";
import {
  Flex, rem, UnstyledButton, Tooltip, Title, Group
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
import classes from "components/Toolbar.module.css";
import logo from "./logo.svg";

const Toolbar = (props) => {
  const [active, setActive] = useState(2);
  // const { menuData } = props;

  const btnStyle = { width: rem(20), height: rem(20) };
  const stroke = 1.5;

  const menuData = [
    {
      Icon: <ICON.save style={btnStyle} stroke={stroke} />,
      label: 'Save work to disk',
      action: () => { console.log('Save work to disk') }
    },
    {
      Icon: <ICON.add style={btnStyle} stroke={stroke} />,
      label: 'Add new app',
      action: () => { console.log('Create new app record') }
    },
    {
      Icon: <IconPlayerTrackPrev style={btnStyle} stroke={stroke} />,
      label: 'Go to previous',
      action: () => { console.log('Go to previous app') }
    },
    {
      Icon: <IconPlayerTrackNext style={btnStyle} stroke={stroke} />,
      label: 'Go to next',
      action: () => { console.log('Go to next app') }
    },
  ];

  const onClick = (action) => {
    typeof action === 'function' && action();
  };

  function NavbarLink({ Icon, label, active, action }) {
    return (
      <Tooltip label={label} position="bottom" transitionProps={{ duration: 0 }}>
        <UnstyledButton onClick={() => onClick(action)} className={classes.link} data-active={active || null}>
          {Icon}
        </UnstyledButton>
      </Tooltip>
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
    <nav className={classes.navbar}>

      <Group justify="flex-start" className={classes.navbarMain}>
        <Flex justify="flex-start" gap={10}>
          {links}
        </Flex>
      </Group>

      <Flex justify="flex-start" gap={20}>
        <NavbarLink icon={IconHome2} label="Change account" />
        <NavbarLink icon={IconSettings} label="Logout" />
      </Flex>
    </nav>
  );

};

export default Toolbar;