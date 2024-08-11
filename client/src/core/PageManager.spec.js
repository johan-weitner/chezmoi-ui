import { describe, it, expect, vi } from 'vitest';
import { usePageManager } from './PageManager';
import { selectPageContent } from 'store/selectors';
import { getState, store, setPage, setPageContent } from 'store/store';
import { mockState } from 'store/mockStore';

vi.mock('store/selectors', () => ({
  selectPageContent: vi.fn(),
}));

vi.mock('store/store', () => ({
  getState: vi.fn(),
  store: {
    dispatch: vi.fn(),
  },
  setPage: vi.fn(),
  setPageContent: vi.fn(),
}));

describe('usePageManager', () => {
  const { dispatch } = store;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gotoPage should dispatch setPage and setPageContent', () => {
    const page = 2;
    const apps = ['app1', 'app2'];
    getState.mockReturnValueOnce({ page });
    selectPageContent.mockReturnValueOnce(apps);

    const { gotoPage } = usePageManager();
    const result = gotoPage(page);

    expect(dispatch).toHaveBeenCalledWith(setPage(page));
    expect(dispatch).toHaveBeenCalledWith(setPageContent(apps));
    expect(result).toEqual(apps);
  });

  it('getPageContent should dispatch setPageContent', () => {
    const apps = ['app1', 'app2'];
    selectPageContent.mockReturnValueOnce(apps);

    const { getPageContent } = usePageManager();
    const result = getPageContent();

    expect(dispatch).toHaveBeenCalledWith(setPageContent([...apps]));
    expect(result).toEqual(apps);
  });

  it('gotoPrevPage should dispatch setPage and getPageContent if page > 1', () => {
    const page = 2;
    getState.mockReturnValueOnce({ page });
    selectPageContent.mockReturnValueOnce(mockState.appCollection);

    vi.mock('store/store', () => ({
      getState: vi.fn(() => mockState),
      store: {
        dispatch: vi.fn()
      },
      setPageContent: vi.fn(),
      setPage: vi.fn(),
    }));

    const { gotoPrevPage } = usePageManager();
    gotoPrevPage();

    expect(dispatch).toHaveBeenCalledWith(setPage(page - 1));
    expect(dispatch).toHaveBeenCalledTimes(2); // setPage and setPageContent
  });

  it('gotoPrevPage should not dispatch if page <= 1', () => {
    const page = 1;
    getState.mockReturnValueOnce({ page });

    const { gotoPrevPage } = usePageManager();
    gotoPrevPage();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('gotoNextPage should dispatch setPage and getPageContent if page < pageCount', () => {
    const page = 1;
    const pageCount = 3;
    const apps = mockState.appCollection
    getState.mockReturnValueOnce({ page, pageCount, apps });
    selectPageContent.mockReturnValueOnce(apps);

    const { gotoNextPage } = usePageManager();
    gotoNextPage();

    expect(dispatch).toHaveBeenCalledWith(setPage(page + 1));
    expect(dispatch).toHaveBeenCalledTimes(2); // setPage and setPageContent
  });

  it('gotoNextPage should not dispatch if page >= pageCount', () => {
    const page = 3;
    const pageCount = 3;
    getState.mockReturnValueOnce({ page, pageCount });

    const { gotoNextPage } = usePageManager();
    gotoNextPage();

    expect(dispatch).not.toHaveBeenCalled();
  });
});