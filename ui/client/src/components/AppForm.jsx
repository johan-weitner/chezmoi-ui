import { useState, useEffect, useRef, forwardRef } from 'react';
import { nanoid } from 'nanoid';
import Tagify from '@yaireo/tagify';
import "@yaireo/tagify/dist/tagify.css";
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

  const TAG_WHITE_LIST = ['mac', 'win', 'linux', 'work', 'home', 'cli', 'desktop', 'dev'];
  window.TAGIFY_DEBUG = false;

  const getField = item => {
    return selectedApp && item.textarea ?
      (<Textarea
        id={item.name}
        defaultValue={selectedApp[item.name]}
        styles={{ height: "200px" }}
        rows="14"
      />) :
      (<Input
        id={item.name}
        defaultValue={selectedApp[item.name]}
      />);
  };

  const formPartOne = [
    { name: '_name', label: 'Name', value: selectedApp?._name },
    { name: 'key', label: 'Key', value: selectedApp?.key },
    { name: '_short', label: 'Short desc', value: selectedApp?._short },
    { name: '_home', label: 'Homepage', value: selectedApp?._home },
    { name: '_docs', label: 'Documentation', value: selectedApp?._docs },
    { name: '_github', label: 'Github', value: selectedApp?._github },
    // { name: '_desc', label: 'Description', value: selectedApp?._desc, textarea: true },
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

  var input = document.querySelector('input[name=tags]');
  new Tagify(input, { whitelist: TAG_WHITE_LIST, enforceWhitelist: true })
  // var tagify = new Tagify(inputElm, {
  //   originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
  // })

  return selectedApp && (
    <Card ref={ ref } className={ isPopoverOpen ? classes.popup : classes.popupClosed} style={{ zIndex:"20000"}}>
      <h2 className={classes.editDetailHeader}>{ selectedApp && selectedApp._name }</h2>
      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Info</h3>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid} style={{marginBottom:"-20px"}}>
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

      <SimpleGrid cols={{ base: 1, md: 1 }} spacing="sm" mt={50} className={classes.grid} style={{marginBottom:"0", marginTop:"-20px", paddingTop:"0"}}>
        <Group display="block" className={ classes.fieldcontainer }>
          <Text component="label" htmlFor="_desc" size="sm" fw={500}>Description</Text>
          <Textarea
            id="_desc"
            defaultValue={selectedApp._desc}
            rows="8"
          />
        </Group>
      </SimpleGrid>

      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Tags</h3>
      <div style={{ marginBottom:"40px", width:"100%" }}>
        <input
          name='tags'
          defaultValue=''
          autoFocus
        />
      </div>

      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Installers</h3>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm" mt={50} className={classes.grid}>
        {
          formPartTwo.map(item => {
            return (
              <Group display="block" className={ classes.fieldcontainer } key={ nanoid() }>
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
