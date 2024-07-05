import {
  useQuery,
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import { getApp, postApp } from '../api/appCollectionApi'

const App = (key) => {
  this.key = key;
  this.queryClient = new QueryClient();
  this.query = useQuery({ queryKey: ['app'], queryFn: getApp })
  this.mutation = useMutation({
    mutationFn: postApp,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['appCollection'] })
    },
  })
};

export default App;
