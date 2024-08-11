import { renderHook, act } from '@testing-library/react-hooks';
import { useDataManager } from './DataManager';
import * as fetchApi from 'api/fetchApi';
import * as store from 'store/store';
import { toast } from 'sonner';
import { usePageManager } from './PageManager';
import { useGroupManager } from './GroupManager';
import { vi } from 'vitest';

vi.mock('api/fetchApi');
vi.mock('store/store');
vi.mock('sonner');
vi.mock('./PageManager');
vi.mock('./GroupManager');

describe('useDataManager', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    store.dispatch = dispatchMock;
    getState = vi.fn().mockReturnValue({
      appCollection: [],
      page: 1,
      pageCount: 1,
      pageSize: 20,
      pageContent: [],
      inReverse: false
    });
    usePageManager.mockReturnValue({
      gotoPage: vi.fn(),
      getPageContent: vi.fn().mockReturnValue([]),
    });
    useGroupManager.mockReturnValue({
      seedGroups: vi.fn(),
    });
  });

  it('should initialize the store correctly with useBootstrap', async () => {
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      result.current.useBootstrap();
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setIsLoading(true));
  });

  it('should update the page content on page change with usePageSwitch', async () => {
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      result.current.usePageSwitch();
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setIsLoading(true));
  });

  it('should fetch apps and tags, and update the store with seedStore', async () => {
    fetchApi.getAllApps.mockResolvedValue([]);
    fetchApi.getAllTags.mockResolvedValue([]);
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.seedStore();
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAppCollection([]));
    expect(dispatchMock).toHaveBeenCalledWith(store.setTotalCount(0));
    expect(dispatchMock).toHaveBeenCalledWith(store.setPageCount(1));
    expect(dispatchMock).toHaveBeenCalledWith(store.setPage(1));
  });

  it('should set the first page content correctly with openFirstPage', async () => {
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      result.current.openFirstPage();
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setSelectedAppKey(undefined));
    expect(dispatchMock).toHaveBeenCalledWith(store.setPageContent([]));
  });

  it('should refresh the app collection based on the filter with refreshAppCollection', async () => {
    fetchApi.fetchUnfinishedApps.mockResolvedValue([]);
    fetchApi.getAllApps.mockResolvedValue([]);
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.refreshAppCollection(true);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAppCollection([]));
  });

  it('should delete an app and update the store with deleteItem', async () => {
    fetchApi.deleteApp.mockResolvedValue();
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.deleteItem(1);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAppCollection([]));
    expect(dispatchMock).toHaveBeenCalledWith(store.setPageContent([]));
  });

  it('should update an app and update the store with updateItem', async () => {
    fetchApi.updateApp.mockResolvedValue({});
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.updateItem({}, [], []);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setSelectedApp({}));
  });

  it('should save a new app and update the store with saveNewItem', async () => {
    fetchApi.saveNewApp.mockResolvedValue({});
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.saveNewItem({}, [], []);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAppCollection([{}]));
  });

  it('should mark an app as done and update the store with flagAppDone', async () => {
    fetchApi.markAppDone.mockResolvedValue({});
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.flagAppDone({}, true);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAppCollection([{}]));
  });

  it('should update the allowed tags and update the store with updateAllowedTags', async () => {
    fetchApi.updateTagWhiteList.mockResolvedValue([]);
    const { result } = renderHook(() => useDataManager());
    await act(async () => {
      await result.current.updateAllowedTags([]);
    });
    expect(dispatchMock).toHaveBeenCalledWith(store.setAllowedTags([]));
  });
});