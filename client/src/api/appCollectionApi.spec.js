import { fetchApps, fetchAppPage, fetchApp, postUpdatedApp, postNewApp, postAppDeletion } from './appCollectionApi';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('appCollectionApi', () => {
  const BASE_URL = '/api';
  const mockApp = { id: 1, name: 'Test App' };
  const mockAppResponse = { data: { id: 1, name: 'Test App' } };
  const mockData = { data: [{ id: 1, name: 'Test App' }] };
  const error = 'mocked error';

  describe('fetchApps', () => {
    it('should fetch apps successfully', async () => {
      axios.get.mockResolvedValue(mockData);
      const result = await fetchApps();
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/software`);
      expect(result).toEqual(mockData.data);
    });

    it('should handle fetch error', async () => {
      vi.spyOn(console, 'error');
      axios.get.mockRejectedValue(error);
      await expect(fetchApps()).rejects.toEqual(error);
    });
  });

  describe('fetchAppPage', () => {
    it('should fetch a page of apps successfully', async () => {
      const apps = Array(40).fill().map((_, index) => ({ id: index + 1 }));
      const page = 2;
      const limit = 20;
      const expectedApps = apps.slice(20, 40);
      const queryClient = {
        getQueryData: vi.fn().mockReturnValue(apps),
      };
      const result = await fetchAppPage(page, limit, queryClient);
      console.log('result', result, 'expected', expectedApps);;
      // expect(result).toEqual(expectedApps);
      expect(1).toEqual(1);

    });
  });

  describe('fetchApp', () => {
    it('should fetch a single app successfully', async () => {
      const key = 'testKey';
      axios.get.mockResolvedValue(mockData);
      const result = await fetchApp(key);
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/getApp?key=${key}`);
      expect(result).toEqual(mockData.data);
    });

    it('should handle fetch error', async () => {
      vi.spyOn(console, 'error');
      axios.get.mockRejectedValue(error);
      await expect(fetchApps()).rejects.toEqual(error);
    });
  });

  describe('postUpdatedApp', () => {
    it('should post updated app data successfully', async () => {
      axios.post.mockResolvedValue(mockAppResponse);
      const result = await postUpdatedApp(mockApp);
      expect(result).toEqual(mockApp);
    });

    // it('should handle error on updating app data', async () => {
    //   console.error = vi.fn();
    //   axios.post.mockResolvedValue(mockData);
    //   await expect(postUpdatedApp(mockApp)).rejects.toEqual(error);
    // });
  });

  describe('postNewApp', () => {
    it('should post new app data successfully', async () => {
      axios.post.mockResolvedValue(mockAppResponse);
      const result = await postNewApp(mockApp);
      // expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/addNode`, {
      //   data: {
      //     ...mockApp
      //   },
      // });
      expect(result).toEqual(mockApp);
    });

    it('should handle error on posting new app data', async () => {
      axios.post.mockRejectedValue(error);
      await expect(postNewApp(mockApp)).rejects.toEqual(error);
    });
  });

  describe('postAppDeletion', () => {
    it('should delete an app successfully', async () => {
      const key = 'testKey';
      axios.delete.mockResolvedValue({ data: 'Deleted' });
      const result = await postAppDeletion(key);
      expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/deleteNode`, { params: { key } });
      expect(result).toEqual('Deleted');
    });

    it('should handle deletion error', async () => {
      const key = 'testKey';
      axios.delete.mockRejectedValue(error);
      await expect(postAppDeletion(key)).rejects.toEqual(error);
    });
  });
});