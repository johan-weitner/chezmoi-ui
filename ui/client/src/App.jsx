import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import Header from './components/Header';
import FeatureCards from './components/FeatureCards';
import { OS } from './constants/strings';

function App() {
  const [data, setData] = useState(null);
  const [allApps, setAllApps] = useState(null);
  const [software, setSoftware] = useState(null);
  const [os, setOs] = useState(OS[0]);

  const switchOs = (newOs) => {
    console.log('Switching to: ' + newOs);
    setOs(newOs);
  };

  useEffect(() => {
    axios.get('http://localhost:3000/')
    .then(response => {
      setData(response.data.packages);
      // console.log(response.data.packages);
    })
    .catch(error => {
      console.error(error);
    });

    axios.get('http://localhost:3000/all')
    .then(response => {
      setAllApps(response.data);
      // console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

    axios.get('http://localhost:3000/software')
    .then(response => {
      setSoftware(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);



  return (
    <>
      <Header alternatives={ OS } switchOs={ switchOs } />
      { data && allApps && software && <FeatureCards data={ data } os={ os } allApps={ allApps } software={ software } /> }
    </>
  )
}

export default App;