import { useState } from 'react';
import { Container, Anchor, Group, Burger, Box } from '@mantine/core';
import classes from './SubHeader.module.css';
import { ICON } from '../constants/icons.js'

const SubHeader = (props) => {
  // const [active, setActive] = useState(0);
  const { keys, changeKey, save, startOver } = props;

  // const links = keys.map(key => {
  //   return { link: '#', label: key };
  // });

  const links = [
      { icon: <ICON.save />, label: 'Save backup', action: save },
      { icon: <ICON.startOver />, label: 'Start over', action: startOver },
    ];

  const mainItems = links.map((item, index) => (
    <Anchor
      href={item.link}
      key={item.label}
      className={classes.mainLink}
      onClick={(event) => {
        event.preventDefault();
        typeof item.action === 'function' && item.action();
      }}
    >
      <span className={ classes.menuIcon }>{item.icon}</span> {item.label}
    </Anchor>
  ));

  console.log('mainItems: ', mainItems);

  return (
    <header className={classes.header}>
      <Container className={classes.inner} style={{  }}>
        <Box className={classes.links} visibleFrom="sm">
          <Group gap={15} justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>
      </Container>
    </header>
  );
}

export default SubHeader;