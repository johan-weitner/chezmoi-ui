import { useState } from 'react';
import { nanoid } from 'nanoid';
import {
  Text,
  Card,
  rem,
  TextInput, ActionIcon
} from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const MergedView = props => {
  const { merged, theme, open, deleteItem, editItem } = props;

  const [filter, setFilter] = useState('');
  // Strip metadata nodes from Install.Doctor array
  const unwanted = [
    "_envchain:deps",
    "_kde",
    "_misc-flatpaks",
    "_nautilus-extensions"
  ]

  const purgedMerged = Object.keys(merged).filter(item => !unwanted.includes(item));
  // console.log('purged: ', purgedMerged);
  const mergedKeys = [];
  purgedMerged.map(item => {
    mergedKeys.push(merged[item].key);
  });
  const mergedNames = [];
  purgedMerged.map(item => {
    mergedNames.push(merged[item]._name);
  });

  const filteredApps = mergedKeys.filter(key => merged[key]._name?.toLowerCase().includes(filter?.toLowerCase()));
  // console.log('filteredApps: ', filteredApps);

  // Merged list
  return (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <ICON.allApps
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left", marginBottom:"30px" }}>
        Merged list
      </Text>
      <TextInput
        radius="xl"
        size="lg"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ margin:"0 14px" }}
        rightSectionWidth={42}
        leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        rightSection={
          <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
            <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        }
        {...props}
      />
      <Card shadow="md" fz="sm" c="dimmed" mt="sm" className={classes.scrollContainer} style={{ textAlign:"left", overflow:"scroll", height:"calc(100vh - 150px)" }}>
      { filteredApps?.length > 0 && filteredApps.map(item => {
          return (
            <div style={{ position:"relative", width:"100%" }} key={ nanoid() }>
              <button className={classes.itemBox} onClick={e => open(e, item)} style={{ width: "100%" }}>
                { merged[item]._name }
              </button>
              {/* <ICON.edit
                style={{ width: rem(20), height: rem(20), position:"absolute", right: "70px", top:"14px" }}
                stroke={2}
                color="white"
                onClick={ () => editItem(item) }
              /> */}
              <ICON.remove
                style={{ width: rem(20), height: rem(20), position:"absolute", right: "20px", top:"14px", cursor:"pointer" }}
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