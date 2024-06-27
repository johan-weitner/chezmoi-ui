import { nanoid } from 'nanoid';
import {
  Text,
  Card,
  rem
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const MergedView = props => {
  const { merged, theme, open, deleteItem, editItem } = props;

  // Strip metadata nodes from Install.Doctor array
  const unwanted = [
    "_envchain:deps",
    "_kde",
    "_misc-flatpaks",
    "_nautilus-extensions"
  ]

  console.log('merged: ', merged);
  const mergedPackages = Object.keys(merged).filter(item => !unwanted.includes(item)).sort();

  // Merged list
  return (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <ICON.allApps
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left" }}>
        Merged list
      </Text>
      <Card shadow="md" fz="sm" c="dimmed" mt="sm" className={classes.scrollContainer} style={{ textAlign:"left", overflow:"scroll", height:"calc(100vh - 150px)" }}>
      { mergedPackages?.length > 0 && mergedPackages.map(item => {
          return (
            <div style={{ position:"relative", width:"100%" }} key={ nanoid() }>
              <button className={classes.itemBox} onClick={e => open(e, item)} style={{ width: "100%" }}>
                { item }
              </button>
              <ICON.edit
                style={{ width: rem(20), height: rem(20), position:"absolute", right: "70px", top:"14px" }}
                stroke={2}
                color="white"
                onClick={ () => editItem(item) }
              />
              <ICON.remove
                style={{ width: rem(20), height: rem(20), position:"absolute", right: "35px", top:"14px" }}
                stroke={2}
                color="white"
                onClick={ () => deleteItem(item) }
              />
            </div>
          );
        }) }
      </Card>
    </Card>
  );
};

export default MergedView;