import { useState, useEffect } from 'react';
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
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);

  useEffect(() => {
    // Listen for ESC key press, and set isPopoverOpen to false when pressed
  document.addEventListener('keydown', (e) => {
    console.log('Add ESC key listener...');
    if (e.key === 'Escape') {
      console.log('Pressed ESC');
      setIsPopoverOpen(false);
      setOpenItemKey(null);
    }
  });
  }), [];

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
    setOpenItem(null);
    deleteApp(openItem.key)
  };

  const editItem = () => {
    console.log('Edit item: ', openItem);
    setIsPopoverOpen(true);
  };

  return (
    <Container size="lg" py="xl" style={{ backgroundColor: "#333" }}>
      {/* <FeatureHeader os={ os } changeKey={ changeKey } /> */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid}>
        {/* { subCategory && <SubcategoryView subCategory={subCategory} theme={ theme } /> }
        { allApps && <AllAppsView allApps={ allApps } theme={ theme } /> }
        { software && <InstallDoctorListView software={software} theme={ theme } /> } */}

        { merged && <MergedView merged={ merged } theme={ theme } open={ open } deleteItem={ deleteApp} editItem={ editItem } />}
        { openItem && <DetailView openItem={ openItem } theme={ theme } deleteItem={ deleteItem } editItem={ editItem } /> }
      </SimpleGrid>
      {/* { merged && <OutputView mergedArray={ merged } /> } */}

        <Card className={ isPopoverOpen ? classes.overlay : classes.overlayClosed}>
          <Text size='xl' className={classes.editDetailHeader}>{ openItem && openItem._name }</Text>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_name" size="sm" fw={500}>Name</Text>
            <Input defaultValue={ openItem?._name } id="_name" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_short" size="sm" fw={500}>Short desc</Text>
            <Input defaultValue={ openItem?._short } id="_short" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_desc" size="sm" fw={500}>Description</Text>
            <Textarea defaultValue={ openItem?._desc } id="_desc" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_home" size="sm" fw={500}>Homepage</Text>
            <Input defaultValue={ openItem?._home } id="_home" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_docs" size="sm" fw={500}>Documentation</Text>
            <Input defaultValue={ openItem?._docs } id="_docs" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="_github" size="sm" fw={500}>Github</Text>
            <Input defaultValue={ openItem?._github } id="_github" />
          </Group>

          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="whalebrew" size="sm" fw={500}>Whalebrew</Text>
            <Input defaultValue={ openItem?.whalebrew } id="whalebrew" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="apt" size="sm" fw={500}>Apt</Text>
            <Input defaultValue={ openItem?.apt } id="apt" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="homebrew" size="sm" fw={500}>Homebrew</Text>
            <Input defaultValue={ openItem?.homebrew } id="homebrew" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="cask" size="sm" fw={500}>Cask</Text>
            <Input defaultValue={ openItem?.go } id="go" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="cargo" size="sm" fw={500}>Cargo</Text>
            <Input defaultValue={ openItem?.cargo } id="cargo" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="npm" size="sm" fw={500}>NPM</Text>
            <Input defaultValue={ openItem?.npm } id="npm" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="pip" size="sm" fw={500}>Pip</Text>
            <Input defaultValue={ openItem?.pip } id="pip" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="pipx" size="sm" fw={500}>Pipx</Text>
            <Input defaultValue={ openItem?.pipx } id="pipx" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="gem" size="sm" fw={500}>Gem</Text>
            <Input defaultValue={ openItem?.gem } id="gem" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="script" size="sm" fw={500}>Script</Text>
            <Input defaultValue={ openItem?.script } id="script" />
          {/*
    - whalebrew
    - apt
    - cask
    - brew
    - go
    - cargo
    - npm
    - pipx
    - pip
    - gem
    - script
    - choco
    - scoop
    - winget
    - pkg-darwin
    - ansible
    - binary
    - appstore
*/}
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="choco" size="sm" fw={500}>Chocolatey</Text>
            <Input defaultValue={ openItem?.choco } id="choco" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="scoop" size="sm" fw={500}>Scoop</Text>
            <Input defaultValue={ openItem?.scoop } id="scoop" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="winget" size="sm" fw={500}>WinGet</Text>
            <Input defaultValue={ openItem?.winget } id="winget" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="pkgdarwin" size="sm" fw={500}>Pkg-Darwin</Text>
            <Input defaultValue={ openItem?.pkgdarwin } id="pkgdarwin" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="ansible" size="sm" fw={500}>Ansible</Text>
            <Input defaultValue={ openItem?.ansible } id="ansible" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="binary" size="sm" fw={500}>Binary</Text>
            <Input defaultValue={ openItem?.binary } id="binary" />
          </Group>
          <Group display="block" className={ classes.fieldcontainer }>
            <Text component="label" htmlFor="appstore" size="sm" fw={500}>AppStore</Text>
            <Input defaultValue={ openItem?.apt } id="appstore" />
          </Group>


          <Group justify='center'>
            <Button onClick={() => setIsPopoverOpen(false)}>Cancel</Button>
            <Button>Save</Button>
          </Group>
        </Card>

    </Container>
  );
}

export default FeaturesCards;
