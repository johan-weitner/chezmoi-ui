import { useState, useEffect, useRef, forwardRef } from 'react';
import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';
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
import useDebounce from '../utils/useDebounce.js';

const AppForm = forwardRef(function AppForm(props, ref) {
  const { isPopoverOpen, setIsPopoverOpen, updateApp, selectedApp } = props;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: selectedApp,
  });
  // const { isPopoverOpen, setIsPopoverOpen, save, selectedApp, handleInputChange } = props;
  const [formState, setFormState] = useState({...selectedApp});
  console.log('selectedApp: ', selectedApp);
  const TAG_WHITE_LIST = ['mac', 'win', 'linux', 'work', 'home', 'cli', 'desktop', 'dev'];
  window.TAGIFY_DEBUG = false;

  useEffect(() => {
    var input = document.querySelector('input[name=tags]');
    new Tagify(input, { whitelist: TAG_WHITE_LIST, enforceWhitelist: true });
    console.log('FormState: ', formState);
  }, []);

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
    { name: 'yay', label: 'Yay' },
    { name: 'appstore', label: 'AppStore' },
  ];



  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log('save');
  // };
  const onSubmit = (data) => {
    // Handle form submission
    console.log('Saving data:', data);
    updateApp(data);
  };

  // const handleChange = (e) => {
  //   console.log(e.target);
  //   const {name: id, value} = e.target;
  //   setFormState((prevFormData) => ({
  //     ...prevFormData,
  //     [id]: value,
  //   }));
  //   console.log(`Changed: ${id} = ${value}`);
  //   console.log('After change: ', formState);
  // };

  return selectedApp && (
    <Card ref={ ref } className={ isPopoverOpen ? classes.popup : classes.popupClosed} style={{ zIndex:"20000"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={classes.editDetailHeader}>{ selectedApp && selectedApp._name }</h2>
      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Info</h3>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mt={50} className={classes.grid} style={{marginBottom:"-20px"}}>
        {
          formPartOne.map(item => {
            return (
              <Group display="block" className={ classes.fieldcontainer } key={nanoid()}>
                <Text component="label" htmlFor={ item.name } size="sm" fw={500}>{ item.label }</Text>
                <Input
                  id={item.name}
                  {...register(item.name)}
                />
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
            rows="8"
            {...register('_desc')}
          />
        </Group>
      </SimpleGrid>

      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Tags</h3>
      <div style={{ marginBottom:"40px", width:"100%" }}>
        <input
          name='tags'
          autoFocus
          {...register('tags')}
        />
      </div>

      <h3 style={{ textAlign:"left", fontSize:"1.8em", fontWeight:"normal", marginTop:"0" }}>Installers</h3>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm" mt={50} className={classes.grid}>
        {
          formPartTwo.map(item => {
            return (
              <Group display="block" className={ classes.fieldcontainer } key={ nanoid() }>
                <Text component="label" htmlFor={ item.name } size="sm" fw={500}>{ item.label }</Text>
                <Input
                  id={ item.name }
                  {...register(item.name)}
                />
              </Group>
            );
          })
        }
      </SimpleGrid>

      <Group justify='center'>
        <Button onClick={() => setIsPopoverOpen(false)} className={ classes.cancelBtn }>Cancel</Button>
        <Button type="submit" className={ classes.saveBtn } leftSection={<ICON.save/>}>Save</Button>
      </Group>
      </form>
    </Card>
  );
});

export default AppForm;
