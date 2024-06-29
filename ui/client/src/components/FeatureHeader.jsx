import { Container, Group, Button, Box } from '@mantine/core';
import classes from './SubHeader.module.css';
import { ICON } from '../constants/icons.js'

const FeatureHeader = props => {
  const { save, startOver } = props;

  const links = [
      { icon: <ICON.save />, label: 'Save backup', action: save },
      { icon: <ICON.startOver />, label: 'Start over', action: startOver },
    ];

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
};

export default FeatureHeader;