import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getState } from 'store/store';
import { log } from 'utils/logger';
import { getAllTags, addAppTags, getTagId, updateTagWhiteList } from './tagsApi';

vi.mock('axios');
vi.mock('store/store', () => ({
  getState: vi.fn(),
}));
vi.mock('utils/logger', () => ({
  log: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('tagsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTags', () => {
    it('should fetch all tags successfully', async () => {
      const mockTags = [{ id: 1, name: 'Tag1' }];
      axios.get.mockResolvedValue({ data: mockTags });

      const tags = await getAllTags();

      expect(tags).toEqual(mockTags);
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/getAllTags`);
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.get.mockRejectedValue(error);

      await expect(getAllTags()).rejects.toThrow(error);
    });
  });

  describe('addAppTags', () => {
    it('should add tags to an app successfully', async () => {
      const mockResponse = { success: true };
      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await addAppTags(1, [1, 2]);

      expect(response).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/addAppTags`, {
        data: {
          appId: 1,
          tagId: [1, 2],
        },
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.post.mockRejectedValue(error);

      await expect(addAppTags(1, [1, 2])).rejects.toThrow(error);
    });
  });

  describe('getTagId', () => {
    it('should return the correct tag ID', () => {
      const mockTags = [{ id: 1, name: 'Tag1' }];
      getState.mockReturnValue({ allowedTags: mockTags });

      const tagId = getTagId('Tag1');

      expect(tagId).toBe(1);
    });

    it('should return -1 if tag is not found', () => {
      getState.mockReturnValue({ allowedTags: [] });

      const tagId = getTagId('Tag1');

      expect(tagId).toBe(-1);
    });
  });

  describe('updateTagWhiteList', () => {
    it('should update the tag whitelist successfully', async () => {
      const mockResponse = { success: true };
      axios.post.mockResolvedValue({ data: mockResponse });
      getState.mockReturnValue({ allowedTags: [{ id: 1, name: 'Tag1' }] });

      const response = await updateTagWhiteList(['Tag2']);

      expect(response).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/updateAllowedTags`, {
        data: {
          removeTags: [1],
          addTags: ['Tag2'],
        },
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Network Error');
      axios.post.mockRejectedValue(error);
      getState.mockReturnValue({ allowedTags: [{ id: 1, name: 'Tag1' }] });

      await expect(updateTagWhiteList(['Tag2'])).rejects.toThrow(error);
    });
  });
});