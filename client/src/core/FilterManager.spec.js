import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilterManager } from './FilterManager';
import { fetchFilteredApps } from 'api/fetchApi';
import { log } from 'utils/logger';
import { toast } from 'sonner';
import { store, setActiveFilter, setFilteredList } from 'store/store';

vi.mock('api/fetchApi', () => ({
  fetchFilteredApps: vi.fn(),
}));

vi.mock('utils/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('store/store', () => ({
  store: {
    dispatch: vi.fn(),
  },
  setActiveFilter: vi.fn(),
  setFilteredList: vi.fn(),
}));

describe('useFilterManager', () => {
  const { dispatch } = store;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applyFilter should dispatch setActiveFilter and setFilteredList on success', async () => {
    const filter = 'testFilter';
    const apps = ['app1', 'app2'];
    fetchFilteredApps.mockResolvedValueOnce(apps);

    const { applyFilter } = useFilterManager();
    const result = await applyFilter(filter);

    expect(dispatch).toHaveBeenCalledWith(setActiveFilter(filter));
    expect(dispatch).toHaveBeenCalledWith(setFilteredList(apps));
    expect(result).toEqual(apps);
  });

  it('applyFilter should log error and show toast on failure', async () => {
    const filter = 'testFilter';
    const errorMessage = 'Error fetching apps';
    fetchFilteredApps.mockRejectedValueOnce(new Error(errorMessage));

    const { applyFilter } = useFilterManager();
    const result = await applyFilter(filter);

    expect(log.error).toHaveBeenCalledWith(errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(result).toBeUndefined();
  });

  it('clearFilter should dispatch setActiveFilter and setFilteredList with null', () => {
    const { clearFilter } = useFilterManager();
    clearFilter();

    expect(dispatch).toHaveBeenCalledWith(setActiveFilter(null));
    expect(dispatch).toHaveBeenCalledWith(setFilteredList(null));
  });
});