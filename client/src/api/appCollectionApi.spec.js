import { fetchApps, getPageSlice, fetchApp, updateApp, saveNewApp, deleteApp } from './appCollectionApi';
import { vi } from 'vitest'
import axios from 'axios';

vi.mock('axios');


const mockAppCollection = Array(50).fill().map((_, i) => ({ id: i + 1 }));

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
    // Test for successful data fetching and slicing
    it('returns the correct slice of apps for the first page', async () => {
      const apps = getPageSlice(1, 10, mockAppCollection);
      expect(apps).toHaveLength(10);
      expect(apps[0].id).toBe(1);
    });

    it('returns the correct slice of apps for a subsequent page', async () => {
      const apps = getPageSlice(2, 10, mockAppCollection);
      expect(apps).toHaveLength(10);
      expect(apps[0].id).toBe(11);
    });

    // Test for empty or undefined data
    it('handles empty array correctly', async () => {
      const apps = getPageSlice(1, 10, []);
      expect(apps).toEqual([]);
    });

    it('handles undefined correctly', async () => {
      expect(() => getPageSlice(1, 10, undefined)).toThrow();
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

  describe('updateApp', () => {
    it('should post updated app data successfully', async () => {
      axios.post.mockResolvedValue(mockAppResponse);
      const result = await updateApp(mockApp);
      expect(result).toEqual(mockApp);
    });

    it('should handle error on updating app data', async () => {
      axios.post.mockResolvedValue(null);
      await expect(() => updateApp(mockApp)).rejects.toThrow();
    });
  });

  describe('saveNewApp', () => {
    it('should post new app data successfully', async () => {
      axios.post.mockResolvedValue(mockAppResponse);
      const result = await saveNewApp(mockApp);
      // expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/addNode`, {
      //   data: {
      //     ...mockApp
      //   },
      // });
      expect(result).toEqual(mockApp);
    });

    it('should handle error on posting new app data', async () => {
      axios.post.mockRejectedValue(error);
      await expect(saveNewApp(mockApp)).rejects.toEqual(error);
    });
  });

  describe('deleteApp', () => {
    it('should delete an app successfully', async () => {
      const key = 'testKey';
      axios.delete.mockResolvedValue({ data: 'Deleted' });
      const result = await deleteApp(key);
      expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/deleteNode`, { params: { key } });
      expect(result).toEqual('Deleted');
    });

    it('should handle deletion error', async () => {
      const key = 'testKey';
      axios.delete.mockRejectedValue(error);
      await expect(deleteApp(key)).rejects.toEqual(error);
    });
  });
});