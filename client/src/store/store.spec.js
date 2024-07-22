import { useStore, rootStore } from './store';
import { describe, expect, it, vi } from 'vitest';

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10) || 20;

const mockCollection = [{ id: 1, name: 'App 1' }, { id: 2, name: 'App 2' }];

describe('useStore', () => {
  it('should return an object with initial values', () => {
    const state = rootStore.store.getState();
    expect(state.appCollection).toBeNull();
    expect(state.totalCount).toBe(0);
    expect(state.page).toBe(0);
    expect(state.pageCount).toBe(0);
    expect(state.pageContent).toBeNull();
    expect(state.getTotalSize(state)).toEqual(0);
    expect(state.pageSize).toBe(PAGE_SIZE); // Assuming default PAGE_SIZE is 10
    expect(state.inReverse).toBe(false);
    expect(state.filterModel).toEqual(expect.any(Object));
    expect(state.activeFilter).toBeNull();
    expect(state.filteredList).toBeNull();
    expect(state.selectedApp).toBeNull();
    expect(state.selectedAppKey).toBeNull();
    expect(state.editMode).toBe(false);
    expect(state.isNewApp).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should update appCollection when setAppCollection is called', () => {
    const store = useStore();
    const apps = [...mockCollection];
    rootStore.set.appCollection(apps);
    expect(rootStore.get.appCollection('appCollection')).toEqual(apps);
  });
});

describe('rootStore', () => {
  it('should return the initial state when getState is called', () => {
    const state = rootStore.store.getState();

    expect(state.appCollection).toEqual(mockCollection);
    expect(state.totalCount).toBe(0);
    expect(state.page).toBe(0);
    expect(state.pageCount).toBe(0);
    expect(state.pageContent).toBeNull();
    expect(state.getTotalSize(state)).toEqual(2);
    expect(state.pageSize).toBe(PAGE_SIZE); // Assuming default PAGE_SIZE is 10
    expect(state.inReverse).toBe(false);
    expect(state.filterModel).toEqual(expect.any(Object));
    expect(state.activeFilter).toBeNull();
    expect(state.filteredList).toBeNull();
    expect(state.selectedApp).toBeNull();
    expect(state.selectedAppKey).toBeNull();
    expect(state.editMode).toBe(false);
    expect(state.isNewApp).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.middlewares).toEqual(['devtools']);
  });






  // it('should log a message when downloadGenericYaml is called', () => {
  //   console.log = vi.fn();
  //   rootStore.downloadGenericYaml();
  //   expect(console.log).toHaveBeenCalledWith('Not implemented...');
  // });

  // it('should log a message when downloadGenericJson is called', () => {
  //   console.log = vi.fn();
  //   rootStore.downloadGenericJson();
  //   expect(console.log).toHaveBeenCalledWith('Not implemented...');
  // });

  // it('should log a message when downloadInstallDoctorYaml is called', () => {
  //   console.log = vi.fn();
  //   rootStore.downloadInstallDoctorYaml();
  //   expect(console.log).toHaveBeenCalledWith('Not implemented...');
  // });
});