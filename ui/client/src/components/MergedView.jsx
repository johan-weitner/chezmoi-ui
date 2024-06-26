import { nanoid } from 'nanoid';
import {
  Text,
  Card,
  rem
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const MergedView = props => {
  const { merged, theme, open } = props;

  // Strip metadata nodes from Install.Doctor array
  const unwanted = [
    "_envchain:deps",
    "_kde",
    "_misc-flatpaks",
    "_nautilus-extensions"
  ]

  console.log('Merged: ', merged);

  const { softwarePackages } = merged;
  const mergedKeys = Object.keys(softwarePackages).filter(item => !unwanted.includes(item)).sort();

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
      { mergedKeys?.length > 0 && mergedKeys.map(item => {
          return (
            <button key={ nanoid() } className={classes.itemBox} onClick={e => open(e, item)}>
              { item }
            </button>
          );
        }) }
      </Card>
    </Card>
  );
};

export default MergedView;