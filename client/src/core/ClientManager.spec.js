import { describe, it, expect, vi } from 'vitest';
import { useClientManager } from './ClientManager';
import { rootStore } from 'store/store';
import { getAllApps, fetchApp, deleteApp, updateApp, saveNewApp } from 'api/appCollectionApi';

vi.mock('store/store');
vi.mock('api/appCollectionApi');

describe('useClientManager', () => {
  let mockStore;
  let mockGetAllApps;
  let mockFetchApp;
  let mockDeleteApp;
  let mockUpdateApp;
  let mockSaveNewApp;

  beforeEach(() => {
    mockStore = {
      getState: () => {
        return {
          set: {
            isLoading: vi.fn(),
            appCollection: vi.fn(),
            totalCount: vi.fn(),
            pageCount: vi.fn(),
            page: vi.fn(),
            pageContent: vi.fn(),
            selectedApp: vi.fn(),
            selectedAppKey: vi.fn(),
            editMode: vi.fn(),
          },
          get: {
            appCollection: vi.fn(),
            pageSize: vi.fn(),
            pageContent: vi.fn(),
            selectedAppKey: vi.fn(),
          },
          use: {
            page: vi.fn(),
          },
        }
      },

    };

    const mockAppCollection = [{ key: 'app1' }, { key: 'app2' }];
    const mockApp = { key: 'app2' };
    const mockNewApp = { key: 'app3' };

    const asyncMock = vi.fn().mockResolvedValue(42)
    const mockGetAllApps = vi.fn();
    mockFetchApp = vi.fn().mockResolvedValue(mockApp);
    mockDeleteApp = vi.fn();
    mockUpdateApp = vi.fn();
    mockSaveNewApp = vi.fn();

    rootStore.store = mockStore;
    getAllApps.mockResolvedValue(mockGetAllApps);
    fetchApp.mockReturnValue(mockFetchApp);
    deleteApp.mockReturnValue(mockDeleteApp);
    updateApp.mockReturnValue(mockUpdateApp);
    saveNewApp.mockReturnValue(mockSaveNewApp);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('seedStore', () => {
    // it('should fetch all apps and populate the store', async () => {
    //   const mockApps = [{ key: 'app1' }, { key: 'app2' }];
    //   mockGetAllApps.mockResolvedValue(mockApps);

    //   await useClientManager().seedStore();

    //   expect(mockGetAllApps).toHaveBeenCalled();
    //   expect(mockStore.set.appCollection).toHaveBeenCalledWith(mockApps);
    //   expect(mockStore.set.totalCount).toHaveBeenCalledWith(mockApps.length);
    //   expect(mockStore.set.pageCount).toHaveBeenCalledWith(1);
    //   expect(mockStore.set.page).toHaveBeenCalledWith(1);
    //   expect(mockStore.set.pageContent).toHaveBeenCalledWith(mockApps);
    //   expect(mockStore.set.isLoading).toHaveBeenCalledTimes(2);
    //   expect(mockStore.set.isLoading).toHaveBeenNthCalledWith(1, true);
    //   expect(mockStore.set.isLoading).toHaveBeenNthCalledWith(2, false);
    // });

    it('should handle error when fetching apps', async () => {
      const mockGetAllApps = vi.fn();
      const mockError = new Error('Failed to fetch apps');
      vi.spyOn(mockGetAllApps, 'mockGetAllApps').mockRejectedValue(mockError);
      mockGetAllApps.mockRejectedValue(mockError);

      await useClientManager().seedStore();

      expect(mockGetAllApps).toHaveBeenCalled();
      expect(mockStore.set.appCollection).not.toHaveBeenCalled();
      expect(mockStore.set.totalCount).not.toHaveBeenCalled();
      expect(mockStore.set.pageCount).not.toHaveBeenCalled();
      expect(mockStore.set.page).not.toHaveBeenCalled();
      expect(mockStore.set.pageContent).not.toHaveBeenCalled();
      expect(mockStore.set.isLoading).toHaveBeenCalledTimes(2);
      expect(mockStore.set.isLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockStore.set.isLoading).toHaveBeenNthCalledWith(2, false);
      expect(mockStore.set.isLoading).toHaveBeenNthCalledWith(2, false);
    });
  });

  // Add more tests for other functions in useClientManager
});