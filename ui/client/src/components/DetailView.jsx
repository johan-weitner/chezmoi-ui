import {
  Group,
  Text,
  Card,
  rem,
  Button
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const markPopulated = <span className={classes.green}>✓</span>;
const markUnPopulated = <span className={classes.red}>✗</span>;

const DetailView = props => {
  const { selectedApp, deleteItem, editItem, theme } = props;

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
       { selectedApp &&
          <div className={classes.itemBox}>
            <h2 style={{ textAlign:"left", fontWeight:"normal", fontSize:"2em", margin:"0 0 10px 0" }}>
            <a href={ selectedApp._home || selectedApp._github || '#' } target="_blank" style={{ fontWeight: "normal", textDecoration:"none" }}>
              { selectedApp._name || selectedApp._bin }
            </a>
            </h2>
            { selectedApp._short && <Text className={classes.short}>{  selectedApp._short}</Text> }
            { selectedApp._desc && <Text className={classes.desc}>{  selectedApp._desc}</Text> }

            <div className={ classes.indicatorGroup }>
              <Text size='sm'>Homepage { selectedApp._home ? markPopulated : markUnPopulated }</Text>
              <Text size='sm'>Documentation { selectedApp._docs ? markPopulated : markUnPopulated }</Text>
              <Text size='sm'>Github { selectedApp._github ? markPopulated : markUnPopulated }</Text>
            </div>

            <Group justify="center" p="md">
              <Button onClick={ () => editItem() } className={ classes.editBtn } leftSection={<ICON.edit
                style={{ width: rem(20), height: rem(20), marginRight:"10px" }}
                stroke={2}
                color="#FFF"
              />}>Edit</Button>
              <Button onClick={ () => deleteItem(selectedApp.key) } className={ classes.deleteBtn } leftSection={<ICON.remove
                style={{ width: rem(20), height: rem(20), margin:"0 10px 0 0px" }}
                stroke={2}
                color="#FFF"
              />}>Delete</Button>
            </Group>
          </div>
       }
      </Card>
    </Card>
  );
};

export default DetailView;
