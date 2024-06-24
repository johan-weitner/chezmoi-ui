import { useState } from 'react';
import { Container, Anchor, Group, Burger, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './SubHeader.module.css';

// const userLinks = [
//   { link: '#', label: 'Privacy & Security' },
//   { link: '#', label: 'Account settings' },
//   { link: '#', label: 'Support options' },
// ];



const SubHeader = (props) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const { keys, changeKey } = props;

  const mainLinks = [
    { link: '#', label: 'Demo' },
    { link: '#', label: 'Documentation' },
    { link: '#', label: 'Community' },
    { link: '#', label: 'Academy' },
    { link: '#', label: 'Forums' },
  ];

  // const changeKey = key => {
  //   console.log('Change key to: ' + key);
  // };

  const links = keys.map(key => {
    return { link: '#', label: key };
  });

  const mainItems = links.map((item, index) => (
    <Anchor
      href={item.link}
      key={item.label}
      className={classes.mainLink}
      data-active={index === active || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
        changeKey(item.label);
      }}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <header className={classes.header} style={{ margin: "0" }}>
      <Container className={classes.inner} style={{  }}>

        <Box className={classes.links} visibleFrom="sm">
          <Group gap={15} justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </Container>
    </header>
  );
}

export default SubHeader;