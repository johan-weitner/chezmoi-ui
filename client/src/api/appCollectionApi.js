import {
  QueryClient,
  QueryCache,
  useQuery,
  useMutation
} from '@tanstack/react-query';
import axios from "axios";
import { filterUnwantedNodes } from '../utils/installDoctorFilter';
import { CACHE_TTL } from 'constants/settings';

const queryClient = new QueryClient();
// queryClient.setDefaultOptions({
//   queries: {
//     staleTime: CACHE_TTL
//   },
// });

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

export const fetchApp = async (key) => {
  console.log('Fetching app...', key);
  let app = {};
  await axios
    .get(`${BASE_URL}/software`)
    .then((response) => {
      const { data } = response;
      app = data[key]
      console.log('Got app: ', app);
    })
    .catch((error) => {
      console.error(error);
    });
  return app;
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

export const useAppCollection = () => {
  return useQuery({
    queryKey: ['appCollection'],
    queryFn: async () => fetchAppCollection()
  });
};

export const useAppKeys = () => {
  return useQuery({
    queryKey: ['appKeys'],
    queryFn: async () => fetchAppKeys()
  });
};

export const useApp = (key) => {
  return useQuery({
    queryKey: ['app'],
    queryFn: async () => fetchApp(key)
  });
};

export const getApp = async key => {
  const data = await queryClient
    .fetchQuery({
      queryKey: ['app'],
      queryFn: async () => fetchApp(key)
    });
  return data;
};



const postApp = async (item) => {
  console.log('Saving app: ', item);
  if (!item) return;
  item.edited = true;
  const apps = useAppCollection();
  const update = {
    ...apps,
    [item.key]: item
  };
  // await axios
  //   .post(`${baseUrl}/save`, {
  //     ...update,
  //   })
  //   .then((response) => {
  //     const { data } = response;
  //     // toast.success("Saved current state to disk");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     // toast.error(error);
  //   });
  // toast.success("Item was updated");
  return update;
}

const postAppCollection = async (item) => {
  const apps = useAppCollection();
  const update = {
    ...apps,
    [item.key]: item
  };
  await axios
    .post(`${baseUrl}/save`, {
      ...update,
    })
    .then((response) => {
      const { data } = response;
      // toast.success("Saved current state to disk");
      console.log('Saved current state to disk');
    })
    .catch((error) => {
      console.error(error);
      // toast.error(error);
    });
  // toast.success("Item was updated");
  return update;
}

export const postAppKeys = async (keys) => {
  console.log(keys);
}

// Mutations
export const useAppMutation = () => {

  return useMutation({
    mutationFn: async () => postApp(),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['appCollection'] });
    // },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['app', 'appCollection'] });
      console.log('Settled');
    },
    onError: (error) => {
      console.log('Error', error);
    },
    onSuccess: () => {
      // console.log('Success');
      // const collection = useAppCollection();
      // const updateCollection = useAppCollectionMutation();
      // updateCollection.mutate({
      //   ...collection,

      // });
      queryClient.invalidateQueries({ queryKey: ['app', 'appCollection'] });
    }
  });
};

export const useAppCollectionMutation = () => {
  return useMutation({
    mutationFn: async () => postAppCollection(),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['appCollection'] });
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['appCollection'] }),
  });
};

export const useAppKeysMutation = () => {
  return useMutation({
    mutationFn: async () => postAppKeys(),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['appKeys'] });
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['appKeys'] }),
  });
};

