import { useState, useEffect, useRef, forwardRef } from 'react';
import { nanoid } from 'nanoid';
import {
  Group,
  Text,
  Textarea,
  Card,
  Input,
  Button,
  SimpleGrid
} from '@mantine/core';
import classes from './FeatureCards.module.css';
import { ICON } from '../constants/icons';

const AppForm = forwardRef(function AppForm(props, ref) {
  const { isPopoverOpen, setIsPopoverOpen, save, selectedApp } = props;

  const getField = item => {
    return selectedApp && item.textarea ?
      (<Textarea
        id={item.name}
        defaultValue={selectedApp[item.name]}
      />) :
      (<Input
        id={item.name}
        defaultValue={selectedApp[item.name]}
      />);
  };

  const formPartOne = [
    { name: '_name', label: 'Name', value: selectedApp?._name },
    { name: '_short', label: 'Short desc', value: selectedApp?._short },
    { name: '_home', label: 'Homepage', value: selectedApp?._home },
    { name: '_docs', label: 'Documentation', value: selectedApp?._docs },
    { name: '_desc', label: 'Description', value: selectedApp?._desc, textarea: true },
    { name: '_github', label: 'Github', value: selectedApp?._github },
  ];

  const formPartTwo = [
    { name: 'whalebrew', label: 'Whalebrew' },
    { name: 'apt', label: 'Apt' },
    { name: 'homebrew', label: 'Homebrew' },
    { name: 'cask', label: 'Homebrew cask' },
    { name: 'cargo', label: 'Cargo' },
    { name: 'npm', label: 'NPM' },
    { name: 'pip', label: 'Pip' },
    { name: 'pipx', label: 'Pipx' },
    { name: 'gem', label: 'Gem' },
    { name: 'script', label: 'Script' },
    { name: 'choco', label: 'Chocolatey' },
    { name: 'scoop', label: 'Scoop' },
    { name: 'winget', label: 'Winget' },
    { name: 'pkgdarwin', label: 'Pkg-Darwin' },
    { name: 'ansible', label: 'Ansible' },
    { name: 'binary', label: 'Binary' },
    { name: 'appstore', label: 'AppStore' },
  ];
  //

  return selectedApp && (
    <Card ref={ ref } className={ isPopoverOpen ? classes.popup : classes.popupClosed} style={{ zIndex:"20000"}}>
      <h2 className={classes.editDetailHeader}>{ selectedApp && selectedApp._name }</h2>
      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Info</h3>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid} style={{marginBottom:"0"}}>
        {
          formPartOne.map(item => {
            return (
              <Group display="block" className={ classes.fieldcontainer } key={nanoid()}>
                <Text component="label" htmlFor={ item.name } size="sm" fw={500}>{ item.label }</Text>
                { getField(item) }
              </Group>
            );
          })
        }
      </SimpleGrid>

      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Installers</h3>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm" mt={50} className={classes.grid}>
        {
          formPartTwo.map(item => {
            return (
              <Group display="block" className={ classes.fieldcontainer }>
                <Text component="label" htmlFor={ item.name } size="sm" fw={500}>{ item.label }</Text>
                <Input defaultValue={ selectedApp[item.name] } id={ item.name } />
              </Group>
            );
          })
        }
      </SimpleGrid>

      <Group justify='center'>
        <Button onClick={() => setIsPopoverOpen(false)} className={ classes.cancelBtn }>Cancel</Button>
        <Button onClick={ () => save() } className={ classes.saveBtn } leftSection={<ICON.save/>}>Save</Button>
      </Group>
    </Card>
  );
});

export default AppForm;
