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
  const [ selectedApp, setSelectedApp ] = useState(null);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);

  useHotkeys('esc', () => setIsPopoverOpen(false));
  const modalRef = useRef();

  const selectApp = (e, item) => {
    e.preventDefault();
    console.log('Selected item: ', item);
    setSelectedApp(merged[item]);
  };

  const deleteItem = (key) => {
    setSelectedApp(null);
    deleteApp(selectedApp.key)
  };

  const editItem = () => {
    setIsPopoverOpen(true);
  };

  const updateApp = (updatedApp) => {
    updateItem(updatedApp);
    setIsPopoverOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedApp((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const overlayClass = isPopoverOpen ? classes.overlay : classes.hidden;

  return (
    <>
      <Container size="lg" py="xl" style={{ backgroundColor: "#333", paddingTop:"0px" }}>
        <FeatureHeader save={ save } startOver={ startOver } style={{ borderRadius:"10px" }} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid} style={{backgroundColor:"#333"}}>
          { merged && <MergedView merged={ merged } theme={ theme } selectApp={ selectApp } deleteItem={ deleteApp} editItem={ editItem } />}
          { selectedApp && <DetailView selectedApp={ selectedApp } theme={ theme } deleteItem={ deleteItem } editItem={ editItem } /> }
        </SimpleGrid>
        {
          selectedApp && isPopoverOpen && (
            <>
              <AppForm
                ref={ modalRef }
                isPopoverOpen={ isPopoverOpen }
                setIsPopoverOpen={ setIsPopoverOpen }
                updateApp={ updateApp }
                selectedApp={ selectedApp }
                handleInputChange={handleInputChange}
              />
              <div className={ overlayClass }></div>
            </>
          )
        }
      </Container>
    </>
  );
}

export default FeaturesCards;
