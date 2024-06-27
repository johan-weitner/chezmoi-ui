import {
  Group,
  Text,
  Card,
  rem,
  Button
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const DetailView = props => {
  const { openItem, deleteItem, editItem, theme } = props;

  // Detail view
  return (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <ICON.detail
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left" }}>
      Detail view
      </Text>
      <Card shadow="md" fz="sm" c="dimmed" mt="sm" style={{ textAlign:"left" }}>
       { openItem &&
          <div className={classes.itemBox}>
            <Text fz="xl" fw={900} mt="sm" style={{ textAlign:"left" }}>
            <a href={ openItem._home || openItem._github || '#' } target="_blank" style={{ fontWeight: "bold", textDecoration:"none" }}>
              { openItem._name || openItem._bin }
            </a>
            </Text>
            { openItem._short && <Text className={classes.short}>{  openItem._short}</Text> }
            { openItem._desc && <Text className={classes.desc}>{  openItem._desc}</Text> }
            <Group justify="center" p="md">
              <Button onClick={ () => editItem() }><ICON.edit
                style={{ width: rem(20), height: rem(20), marginRight:"10px" }}
                stroke={2}
                color="#FFF"
              />Edit</Button>
              <Button onClick={ () => deleteItem(openItem.key) }><ICON.remove
                style={{ width: rem(20), height: rem(20), margin:"0 10px 0 0px" }}
                stroke={2}
                color="#FFF"
              /> Delete</Button>
            </Group>
          </div>
       }
      </Card>
    </Card>
  );
};

export default DetailView;