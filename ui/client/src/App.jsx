import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import Header from './components/Header';
import FeatureCards from './components/FeatureCards';
import { OS } from './constants/strings';

function App() {
  const [data, setData] = useState(null);
  const [allApps, setAllApps] = useState(null);
  const [software, setSoftware] = useState(null);
  const [merged, setMerged] = useState(null);
  const [os, setOs] = useState(OS[0]);

  const switchOs = (newOs) => {
    // console.log('Switching to: ' + newOs);
    setOs(newOs);
  };

  const saveList = (list) => {
    localStorage.setItem('APP_LIST', JSON.stringify(list));
    setMerged(list);
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
      // console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

    if(localStorage.getItem('APP_LIST')) {
      setMerged(JSON.parse(localStorage.getItem('APP_LIST')))
    } else {
      seedAppList();
    }


  }, []);

  const seedAppList = () => {
    axios.get('http://localhost:3000/merged')
    .then(response => {
      const { data: { softwarePackages } } = response;
      const keys = Object.keys(softwarePackages);
      keys.map(key => {
        softwarePackages[key].key = key;
      });

      saveList(softwarePackages);
      // console.log('Prepped packages: ', merged);
    })
    .catch(error => {
      console.error(error);
    });
  };

  const deleteApp = key => {
    // if (confirm('Are you sure?')) {
      // console.log(`Delete app with key ${key}`);
      delete merged[key];
      saveList({...merged});
    // };
  };

  const saveEditedApp = (key, item) => {
    // console.log(`Saving ${key}:`, item);
    merged[key] = item;
    saveList({...merged});
  };

  const saveNewDocument = () => {
    // console.log('Save new document');
    // console.log('Saving: ', merged);
    // Post "merged" as payload to endpoint /save
    axios.post('http://localhost:3000/save', {
      ...merged
    })
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
  };
  // Content-Type
  // application/json

  const startOver = () => {
    // console.log('Start over');
    localStorage.removeItem('APP_LIST');
    seedAppList();
  };

  const updateItem = item => {
    console.log('Update: ', item);
    merged[item.key] = item;
    saveList({...merged});
  };

  return (
    <>
      <Header alternatives={ OS } switchOs={ switchOs } />
      {
        data &&
        <FeatureCards
          data={ data }
          os={ os }
          allApps={ allApps }
          software={ software }
          merged={ merged }
          deleteApp={ deleteApp }
          save={ saveNewDocument }
          startOver={ startOver }
          updateItem={ updateItem }
        /> }
    </>
  )
}

export default App;