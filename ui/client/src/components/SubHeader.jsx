import { useState } from 'react';
import { Container, Anchor, Group, Button, Box } from '@mantine/core';
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
// export type ButtonVariant = 'filled' | 'light' | 'outline' | 'transparent' | 'white' | 'subtle' | 'default' | 'gradient';
  const mainItems = links.map((item, index) => (
    <Button
      href={item.link}
      key={item.label}
      className={classes.mainLink}
      leftSection={ item.icon }
      variant="transparent"
      onClick={(event) => {
        event.preventDefault();
        typeof item.action === 'function' && item.action();
      }}
    >
      {item.label}
    </Button>
  ));

  // console.log('mainItems: ', mainItems);

  return (
    <header className={classes.header}>
      <Container className={classes.inner} style={{margin:"0"}}>
        <Box className={classes.links} visibleFrom="sm">
          <Group gap={0} justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>
      </Container>
    </header>
  );
}

export default SubHeader;