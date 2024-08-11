import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getState } from 'store/store';
import { log } from 'utils/logger';
import { appHasInstaller } from 'api/helpers';
import {
  isColumnEmpty,
  filterNoInstallerApps,
  filterNoUrlsApps,
  filterNoDescsApps,
  filterNoNamesApps,
  filterModel,
} from './filterApi';

vi.mock('store/store', () => ({
  getState: vi.fn(),
}));
vi.mock('utils/logger', () => ({
  log: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('api/helpers', () => ({
  appHasInstaller: vi.fn(),
}));

describe('filterApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('_isColumnEmpty', () => {
    it('should return true for empty or null columns', () => {
      expect(isColumnEmpty('')).toBe(true);
      expect(isColumnEmpty(null)).toBe(true);
    });

    it('should return false for non-empty columns', () => {
      expect(isColumnEmpty('non-empty')).toBe(false);
    });
  });

  describe('filterNoInstallerApps', () => {
    it('should filter apps without installers', () => {
      const mockApps = [{ id: 1 }, { id: 2 }];
      getState.mockReturnValue({ appCollection: mockApps });
      appHasInstaller.mockImplementation((app) => app.id === 1);

      const result = filterNoInstallerApps();

      expect(result).toEqual([{ id: 2 }]);
    });
  });

  describe('filterNoUrlsApps', () => {
    it('should filter apps without URLs', () => {
      const mockApps = [
        { id: 1, home: '', docs: '', github: '' },
        { id: 2, home: 'home', docs: 'docs', github: 'github' },
      ];
      getState.mockReturnValue({ appCollection: mockApps });

      const result = filterNoUrlsApps();

      expect(result).toEqual([{ id: 1, home: '', docs: '', github: '' }]);
      expect(log.debug).toHaveBeenCalledWith('Apps: ', mockApps);
    });
  });

  describe('filterNoDescsApps', () => {
    it('should filter apps without descriptions', () => {
      const mockApps = [{ id: 1, desc: '' }, { id: 2, desc: 'description' }];
      getState.mockReturnValue({ appCollection: mockApps });

      const result = filterNoDescsApps();

      expect(result).toEqual([{ id: 1, desc: '' }]);
    });
  });

  describe('filterNoNamesApps', () => {
    it('should filter apps without names', () => {
      const mockApps = [{ id: 1, name: '' }, { id: 2, name: 'name' }];
      getState.mockReturnValue({ appCollection: mockApps });

      const result = filterNoNamesApps();

      expect(result).toEqual([{ id: 1, name: '' }]);
    });
  });

  describe('filterModel', () => {
    it('should contain the correct filter configurations', () => {
      expect(filterModel).toEqual({
        installers: {
          key: 'installers',
          title: 'Apps without installers',
        },
        urls: {
          key: 'urls',
          title: 'Apps without URLs',
        },
        name: {
          key: 'name',
          title: 'Apps without name',
        },
        desc: {
          key: 'desc',
          title: 'Apps without description',
        },
      });
    });
  });
});