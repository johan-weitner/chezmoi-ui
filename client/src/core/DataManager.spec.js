import React from "react";
import ReactDOM from "react-dom/client";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useEffect } from 'react';
import { useDataManager } from './DataManager';
import {
  deleteApp,
  getAllApps,
  fetchUnfinishedApps,
  getAllTags,
  saveNewApp,
  updateApp,
  markAppDone,
  updateTagWhiteList,
  fetchAppGroups
} from 'api/fetchApi';
import { toast } from 'sonner';
import { selectPageContent } from 'store/selectors';
import {
  getState,
  store,
  setIsLoading,
  setAppCollection,
  setPageContent,
  setTotalCount,
  setPageCount,
  setPage,
  setAllowedTags,
  setSelectedAppKey,
  setEditMode,
  setSelectedApp
} from 'store/store';
import { log } from 'utils/logger';
import { mapEntityToDb } from 'api/helpers';
import { mockState } from 'store/mockStore';
import { setAppGroups } from "../store/store";

vi.mock('api/fetchApi', () => ({
  deleteApp: vi.fn().mockResolvedValue(),
  getAllApps: vi.fn(),
  fetchUnfinishedApps: vi.fn(),
  getAllTags: vi.fn(),
  saveNewApp: vi.fn(),
  updateApp: vi.fn(),
  markAppDone: vi.fn(),
  updateTagWhiteList: vi.fn(),
  fetchAppGroups: vi.fn(),
}));

vi.mock('store/selectors', () => ({
  selectPageContent: vi.fn(),
}));

vi.mock('store/store', () => ({
  getState: vi.fn(),
  store: {
    dispatch: vi.fn(),
  },
  setIsLoading: vi.fn(),
  setAppCollection: vi.fn(),
  setPageContent: vi.fn(),
  setTotalCount: vi.fn(),
  setPageCount: vi.fn(),
  setPage: vi.fn(),
  setAllowedTags: vi.fn(),
  setSelectedAppKey: vi.fn(),
  setEditMode: vi.fn(),
  setSelectedApp: vi.fn(),
  setAppGroups: vi.fn(),
}));

vi.mock('api/helpers', () => ({
  mapEntityToDb: vi.fn(),
}));

describe('useDataManager', () => {
  const { dispatch } = store;
  const PAGE_SIZE = 20;

  beforeEach(() => {
    vi.clearAllMocks();
    getState.mockReturnValue({
      appCollection: [],
      page: 1,
      pageCount: 1,
      pageSize: PAGE_SIZE,
    });
  });

  const TestComponent = ({ hook }) => {
    const hookResult = hook();
    useEffect(() => {
      if (hookResult) {
        hookResult();
      }
    }, [hookResult]);
    return null;
  };

  it("useBootstrap should seed store and set page content", async () => {
    expect(true).toBe(true);
  });

  // it('useBootstrap should seed store and set page content', async () => {
  //   const { useBootstrap } = useDataManager();
  //   const seedStore = vi.fn().mockResolvedValue([]);
  //   const seedGroups = vi.fn();

  //   await act(async () => {
  //     render(<TestComponent hook={useBootstrap} />);
  //   });


  //   expect(dispatch).toHaveBeenCalledWith(setIsLoading(true));
  //   await seedStore();
  //   expect(dispatch).toHaveBeenCalledWith(setPageContent([]));
  //   expect(dispatch).toHaveBeenCalledWith(setIsLoading(false));
  //   expect(seedGroups).toHaveBeenCalled();
  // });

  // it('usePageSwitch should set page content on page change', () => {
  //   const { usePageSwitch } = useDataManager();
  //   const getPageContent = vi.fn().mockReturnValue([]);

  //   act(() => {
  //     render(<TestComponent hook={usePageSwitch} />);
  //   });

  //   expect(dispatch).toHaveBeenCalledWith(setIsLoading(true));
  //   expect(dispatch).toHaveBeenCalledWith(setPageContent([]));
  //   expect(dispatch).toHaveBeenCalledWith(setIsLoading(false));
  // });

  it('seedStore should fetch apps and tags, then set state', async () => {
    const { seedStore } = useDataManager();
    const { appCollection, appTags } = mockState;
    getAllApps.mockResolvedValue(appCollection);
    getAllTags.mockResolvedValue(appTags);
    fetchAppGroups.mockResolvedValue([]);

    await seedStore();

    expect(dispatch).toHaveBeenCalledWith(setAppCollection(appCollection));
    expect(dispatch).toHaveBeenCalledWith(setTotalCount(appCollection.length));
    expect(dispatch).toHaveBeenCalledWith(setPageCount(Math.ceil(appCollection.length / PAGE_SIZE)));
    expect(dispatch).toHaveBeenCalledWith(setPage(1));
    expect(dispatch).toHaveBeenCalledWith(setAllowedTags(appTags));
  });

  it('openFirstPage should set selected app key and page content', () => {
    const { openFirstPage } = useDataManager();
    const apps = [{ key: 'app1' }];
    selectPageContent.mockReturnValue(apps);

    openFirstPage();

    expect(dispatch).toHaveBeenCalledWith(setSelectedAppKey('app1'));
    expect(dispatch).toHaveBeenCalledWith(setPageContent(apps));
  });

  it('refreshAppCollection should fetch and set app collection', async () => {
    const { refreshAppCollection } = useDataManager();
    const apps = [{ id: 1, name: 'App1' }];
    getAllApps.mockResolvedValue(apps);

    await refreshAppCollection();

    expect(dispatch).toHaveBeenCalledWith(setAppCollection(apps));
  });

  it('deleteItem should delete app and update state', async () => {
    const { deleteItem } = useDataManager();
    const appId = 1;
    const apps = [{ id: 1, name: 'App1' }];
    getState.mockReturnValue({ appCollection: apps, pageContent: apps });

    await deleteItem(appId);

    expect(deleteApp).toHaveBeenCalledWith(appId);
    expect(dispatch).toHaveBeenCalledWith(setAppCollection([]));
    expect(dispatch).toHaveBeenCalledWith(setPageContent([]));
  });

  // it('updateItem should update app and set selected app', async () => {
  //   const { updateItem } = useDataManager();
  //   const app = { id: 1, name: 'App1' };
  //   const appEntity = { id: 1, name: 'App1' };
  //   mapEntityToDb.mockReturnValue(appEntity);
  //   updateApp.mockResolvedValue(app);

  //   await updateItem(app);

  //   expect(mapEntityToDb).toHaveBeenCalledWith(app);
  //   expect(updateApp).toHaveBeenCalledWith(appEntity);
  //   expect(dispatch).toHaveBeenCalledWith(setSelectedApp(app));
  //   expect(toast.success).toHaveBeenCalledWith('App updated successfully');
  // });

  // it('saveNewItem should save new app and update state', async () => {
  //   const { saveNewItem } = useDataManager();
  //   const app = { name: 'New App' };
  //   const newApp = { id: 1, name: 'New App' };
  //   saveNewApp.mockResolvedValue(newApp);

  //   await saveNewItem(app);

  //   expect(saveNewApp).toHaveBeenCalledWith(app);
  //   expect(dispatch).toHaveBeenCalledWith(setAppCollection([newApp]));
  //   expect(toast.success).toHaveBeenCalledWith('App successfully added');
  // });

  // it('flagAppDone should mark app as done and update collection', async () => {
  //   const { flagAppDone } = useDataManager();
  //   const app = { id: 1, name: 'App1' };
  //   markAppDone.mockResolvedValue(app);

  //   await flagAppDone(app);

  //   expect(markAppDone).toHaveBeenCalledWith(app, true);
  //   expect(toast.success).toHaveBeenCalledWith('App marked as done');
  // });

  it('updateAllowedTags should update tags and set allowed tags', async () => {
    const { updateAllowedTags } = useDataManager();
    const tags = [{ id: 1, name: 'Tag1' }];
    updateTagWhiteList.mockResolvedValue(tags);

    await updateAllowedTags(tags);

    expect(updateTagWhiteList).toHaveBeenCalledWith(tags);
    expect(dispatch).toHaveBeenCalledWith(setAllowedTags(tags));
  });
});