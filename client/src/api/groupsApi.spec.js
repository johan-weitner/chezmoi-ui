import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { store, setSelectedGroup } from 'store/store';
import { log } from 'utils/logger';
import { fetchAppGroups, fetchAppsInGroup, addAppToGroup, removeAppFromGroup } from './groupsApi';
import { processMetaGroups, testProcessMetaGroups } from 'utils/groupUtils';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

vi.mock('axios');
vi.mock('store/store', () => ({
  store: {
    dispatch: vi.fn(),
  },
  setSelectedGroup: vi.fn(),
}));
vi.mock('utils/logger', () => ({
  log: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('utils/groupUtils', () => ({
  processMetaGroups: vi.fn(),
  testProcessMetaGroups: vi.fn(),
}));

describe('groupsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAppGroups', () => {
    it('should fetch all groups successfully', async () => {
      const mockGroups = { groups: { Group1: { id: 1, name: 'Group1' } } };
      axios.get.mockResolvedValue({ data: mockGroups });
      processMetaGroups.mockReturnValue(mockGroups.groups);

      const groups = await fetchAppGroups();

      expect(groups).toEqual(mockGroups.groups);
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/groups`);
      expect(processMetaGroups).toHaveBeenCalledWith(mockGroups.groups);
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.get.mockRejectedValue(error);

      await expect(fetchAppGroups()).rejects.toThrow(error);
    });
  });

  describe('fetchAppsInGroup', () => {
    it('should fetch apps in a group successfully', async () => {
      const mockGroupData = { groups: [{ id: 1, name: 'Group1' }] };
      axios.get.mockResolvedValue({ data: mockGroupData });
      processMetaGroups.mockReturnValue(mockGroupData.groups);

      const groupId = 1;
      const apps = await fetchAppsInGroup(groupId);

      expect(apps.groups).toEqual(mockGroupData.groups);
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/group-apps?groupId=${groupId}`);
      expect(processMetaGroups).toHaveBeenCalledWith(mockGroupData.groups);
      expect(testProcessMetaGroups).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.get.mockRejectedValue(error);

      await expect(fetchAppsInGroup(1)).rejects.toThrow(error);
    });
  });

  describe('addAppToGroup', () => {
    it('should add an app to a group successfully', async () => {
      const mockResponse = { data: { id: 1, name: 'Group1' } };
      axios.post.mockResolvedValue(mockResponse);

      const groupId = 1;
      const appId = 1;
      const response = await addAppToGroup(groupId, appId);

      expect(response).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/addAppToGroup`, {
        data: {
          appId: 1,
          groupId: 1,
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(setSelectedGroup(mockResponse.data));
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.post.mockRejectedValue(error);

      await expect(addAppToGroup(1, 1)).rejects.toThrow(error);
    });
  });

  describe('removeAppFromGroup', () => {
    it('should remove an app from a group successfully', async () => {
      const mockResponse = { data: { success: true } };
      axios.delete.mockResolvedValue(mockResponse);

      const groupId = 1;
      const appId = 1;
      const response = await removeAppFromGroup(groupId, appId);

      expect(response).toEqual(mockResponse.data);
      expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/removeAppFromGroup`, {
        data: {
          appId: 1,
          groupId: 1,
        },
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.delete.mockRejectedValue(error);

      await expect(removeAppFromGroup(1, 1)).rejects.toThrow(error);
    });
  });
});