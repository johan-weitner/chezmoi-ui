import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import {
  SimpleGrid,
  Container,
  useMantineTheme,
} from '@mantine/core';
import { useHotkeys } from 'react-hotkeys-hook';
import classes from './FeatureCards.module.css';
import { SUBCAT } from '../constants/strings';
import { ICON } from '../constants/icons';
import FeatureHeader from './FeatureHeader';
import MergedView from './MergedView';
import DetailView from './DetailView';
import AppForm from './AppForm.jsx';

const FeaturesCards = (props) => {
  const { data, os, allApps, software, merged, deleteApp, save, startOver, updateItem } = props;
  const theme = useMantineTheme();
  const [ key, setKey ] = useState('brews');
  const [ openItem, setOpenItem ] = useState(null);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);
  const [ delayClickHandler, setDelayClickHandler ] = useState(false);

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

  useHotkeys('esc', () => setIsPopoverOpen(false));
  const modalRef = useRef();
  // useClickOutside(modalRef, () => {
  //   if (!delayClickHandler && isPopoverOpen) {
  //     setIsPopoverOpen(false);
  //     setDelayClickHandler(true);
  //   }
  // })

  // const subCategory = subCats.find(subCategory => subCategory.key === key);

  const changeKey = key => {
    // console.log(key);
    setKey(key);
  };

  const open = (e, item) => {
    e.preventDefault();
    // console.log('OpenItem: ', item);
    // setDelayClickHandler(true);
    setOpenItem(merged[item]);
    // setTimeout(() => setDelayClickHandler(false), 3000);
  };

  const deleteItem = (key) => {
    setOpenItem(null);
    deleteApp(openItem.key)
  };

  const editItem = () => {
    // console.log('Edit item: ', openItem);
    setIsPopoverOpen(true);
  };

  const updateApp = () => {
    // console.log('Save: ', openItem);
    updateItem(openItem);
    setIsPopoverOpen(false);
  };

  const overlayClass = isPopoverOpen ? classes.overlay : classes.hidden;

  return (
    <>
      <Container size="lg" py="xl" style={{ backgroundColor: "#333", paddingTop:"1px" }}>
        <FeatureHeader os={ os } changeKey={ changeKey } save={ save } startOver={ startOver } style={{ borderRadius:"10px" }} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid}>
          {/* { subCategory && <SubcategoryView subCategory={subCategory} theme={ theme } /> }
          { allApps && <AllAppsView allApps={ allApps } theme={ theme } /> }
          { software && <InstallDoctorListView software={software} theme={ theme } /> } */}
          { merged && <MergedView merged={ merged } theme={ theme } open={ open } deleteItem={ deleteApp} editItem={ editItem } />}
          { openItem && <DetailView openItem={ openItem } theme={ theme } deleteItem={ deleteItem } editItem={ editItem } /> }
        </SimpleGrid>
        {/* { merged && <OutputView mergedArray={ merged } /> } */}
      </Container>
      <AppForm
        ref={ modalRef }
        isPopoverOpen={ isPopoverOpen }
        setIsPopoverOpen={ setIsPopoverOpen }
        save={ updateApp }
        selectedApp={ openItem }
      />
      <div className={ overlayClass }></div>
    </>
  );
}

export default FeaturesCards;
