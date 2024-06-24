import { useState } from 'react';
import { nanoid } from 'nanoid';
import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { SUBCAT } from '../constants/strings';
import { ICON } from '../constants/icons';
import SubHeader from './SubHeader';

const FeaturesCards = (props) => {
  const { data, os, allApps, software } = props;
  const theme = useMantineTheme();
  const [ key, setKey ] = useState('brews');

  const root = data[os];
  console.log('data[os]: ', root);
  const keys = Object.keys(root).filter(item => { return item !== 'pre' });


  const subCats = root && keys.map(sub => {
    return {
      title: SUBCAT[sub],
      listItems: root[sub] || [],
      icon: ICON[sub],
      key: sub
    };
  });

  console.log('subCats: ', subCats);

  const changeKey = key => {
    console.log(key);
    setKey(key);
  };

  const subCategory = subCats.find(subCategory => subCategory.key === key);

  const currentView = (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <subCategory.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left" }}>
        {subCategory.title}
      </Text>
      <Card fz="sm" c="dimmed" mt="sm" style={{ textAlign:"left" }}>
        { subCategory?.listItems?.length > 0 && subCategory.listItems.map(item => {
          return (
            <div key={ nanoid() } className={classes.itemBox}>
              {typeof item === 'string' ? item : item.name}
            </div>
          );
        }) }
      </Card>
    </Card>
  );

  const allAppsView = (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <ICON.allApps
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left" }}>
        All apps
      </Text>
      <Card fz="sm" c="dimmed" mt="sm" style={{ textAlign:"left" }}>
        { allApps?.length > 0 && allApps.map(item => {
          return (
            <div key={ nanoid() } className={classes.itemBox}>
              { item }
            </div>
          );
        }) }
      </Card>
    </Card>
  );

  const unwanted = [
    "_envchain:deps",
    "_kde",
    "_misc-flatpaks",
    "_nautilus-extensions"
  ]
  const { softwarePackages } = software;
  const softwareKeys = Object.keys(softwarePackages).filter(item => !unwanted.includes(item));
  const softwareView = (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <ICON.allApps
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" style={{ textAlign:"left" }}>
        Install.Doctor Software List
      </Text>
      <Card fz="sm" c="dimmed" mt="sm" style={{ textAlign:"left" }}>
        { softwareKeys?.length > 0 && softwareKeys.map(item => {
          return (
            <div key={ nanoid() } className={classes.itemBox}>
              <a href={ softwarePackages[item]._home || softwarePackages[item]._github || '#' } target="_blank">
                { softwarePackages[item]._name || softwarePackages[item]._bin }
              </a>
            </div>
          );
        }) }
      </Card>
    </Card>
  );

  return (
    <Container size="lg" py="xl" style={{ backgroundColor: "#333" }}>
      <Group justify="center">
        <Badge variant="filled" size="xl">
          <span style={{ textTransform:"capitalize" }}>{ os }</span>
        </Badge>
      </Group>
      <SubHeader keys={ keys } changeKey={ changeKey } />
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm" mt={50} className={classes.grid}>
        {currentView}
        {allAppsView}
        {softwareView}
      </SimpleGrid>
    </Container>
  );
}

export default FeaturesCards;
