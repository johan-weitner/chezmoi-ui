import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from "axios";
import { filterUnwantedNodes } from '../utils/installDoctorFilter';

const BASE_URL = '/api';

export const fetchAppCollection = async () => {
  console.log('Fetching software collection...');
  let purgedList;
  await axios
    .get(`${BASE_URL}/software`)
    .then((response) => {
      const { data } = response;
      const keys = Object.keys(data);
      keys.map((key) => {
        data[key].key = key;
      });
      purgedList = filterUnwantedNodes(data);
      console.log('Got software collection');
    })
    .catch((error) => {
      console.error(error);
    });
  return purgedList;
};

export const fetchAppKeys = async () => {
  console.log('Fetching software keys...');
  let keys;
  await axios
    .get(`${BASE_URL}/softwareKeys`)
    .then((response) => {
      keys = response.data;
      console.log('Got software keys');
    })
    .catch((error) => {
      console.error(error);
    });
  return keys;
};