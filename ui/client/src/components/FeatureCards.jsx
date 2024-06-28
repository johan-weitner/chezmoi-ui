import { useState } from 'react';
import { nanoid } from 'nanoid';
import YAML from 'yaml';
import {
  Badge,
  Group,
  Title,
  Text,
  Textarea,
  Card,
  SimpleGrid,
  Container,
  Input,
  rem,
  useMantineTheme,
  ButtonGroup,
  Button
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { SUBCAT } from '../constants/strings';
import { ICON } from '../constants/icons';
import SubHeader from './SubHeader';
import SubcategoryView from './SubcategoryView';
import AllAppsView from './AllAppsView';
import InstallDoctorListView from './InstallDoctorListView';
import FeatureHeader from './FeatureHeader';
import MergedView from './MergedView';
import DetailView from './DetailView';
import OutputView from './OutputView.jsx';

const FeaturesCards = (props) => {
  const { data, os, allApps, software, merged, deleteApp } = props;
  const theme = useMantineTheme();
  const [ key, setKey ] = useState('brews');
  const [ openItem, setOpenItem ] = useState(null);
  const [ openItemKey, setOpenItemKey ] = useState(null);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState();

  // Root node is the chosen OS
  const root = data[os];
  // console.log('data[os]: ', root);
  const keys = Object.keys(root).filter(item => { return item !== 'pre' });

  // Prepare subcategories for viewing
  const subCats = root && keys.map(sub => {
    return {
      title: SUBCAT[sub],
      listItems: root[sub] || [],
      icon: ICON[sub],
      key: sub
    };
  });

  // Extract chosen subcategory
  const subCategory = subCats.find(subCategory => subCategory.key === key);

  // Switch view by subcategory node
  const changeKey = key => {
    console.log(key);
    setKey(key);
  };

  const open = (e, item) => {
    e.preventDefault();
    console.log('OpenItem: ', item);
    setOpenItem(merged[item]);
    setOpenItemKey(item);
  };

  // deleteItem, editItem
  const deleteItem = (key) => {
    confirm("Are you sure?", () => { deleteApp(openItem.key) });
  };

  const editItem = () => {
    console.log('Edit item: ', openItem);
  };



  return (
    <Container size="lg" py="xl" style={{ backgroundColor: "#333" }}>
      {/* <FeatureHeader os={ os } changeKey={ changeKey } /> */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid}>
        {/* { subCategory && <SubcategoryView subCategory={subCategory} theme={ theme } /> }
        { allApps && <AllAppsView allApps={ allApps } theme={ theme } /> }
        { software && <InstallDoctorListView software={software} theme={ theme } /> } */}

        { merged && <MergedView merged={ merged } theme={ theme } open={ open } deleteItem={ deleteApp} editItem={ editItem } />}
        { openItem && <DetailView openItem={ openItem } theme={ theme } deleteItem={ deleteApp} editItem={ editItem } /> }
      </SimpleGrid>
      {/* { merged && <OutputView mergedArray={ merged } /> } */}
      <Container className={classes.overlay}>
        <Card>
          <Text size='xl' className={classes.editDetailHeader}>Header</Text>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_name" size="sm" fw={500}>Name</Text>
            <Input defaultValue={ null } id="_name" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_short" size="sm" fw={500}>Short desc</Text>
            <Input defaultValue={ null } id="_short" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_desc" size="sm" fw={500}>Description</Text>
            <Textarea defaultValue={ null } id="_desc" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_home" size="sm" fw={500}>Homepage</Text>
            <Input defaultValue={ null } id="_home" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_docs" size="sm" fw={500}>Documentation</Text>
            <Input defaultValue={ null } id="_docs" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_github" size="sm" fw={500}>Github</Text>
            <Input defaultValue={ null } id="_github" />
          </Group>
        </Card>
      </Container>
    </Container>
  );
}

export default FeaturesCards;