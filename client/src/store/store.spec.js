import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer, {
  setMainView,
  setAppCollection,
  setAppGroups,
  setTotalCount,
  setPage,
  setPageCount,
  setPageContent,
  setInReverse,
  setActiveFilter,
  setFilteredList,
  setSelectedApp,
  setSelectedAppKey,
  setSelectedAppTags,
  setSelectedAppGroups,
  setSelectedGroup,
  setSelectedGroupKey,
  setSelectedGroupId,
  setAllowedTags,
  setEditMode,
  setIsNewApp,
  setHideCompleted,
  setIsLoading,
  setError,
  getState,
  store
} from './store';

describe('Redux Store', () => {

  beforeEach(() => {
  });

  it('should have the correct initial state', () => {

    const state = store.getState().root;
    expect(state.mainView).toBe('apps');
    expect(state.appCollection).toBeNull();
    expect(state.appGroups).toEqual([]);
    expect(state.totalCount).toBe(0);
    expect(state.page).toBe(0);
    expect(state.pageCount).toBe(0);
    expect(state.pageContent).toBeNull();
    expect(state.pageSize).toBe(Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10));
    expect(state.inReverse).toBe(false);
    expect(state.activeFilter).toBeNull();
    expect(state.filteredList).toBeNull();
    expect(state.selectedApp).toBeNull();
    expect(state.selectedAppKey).toBeNull();
    expect(state.selectedAppTags).toBeNull();
    expect(state.selectedAppGroups).toBeNull();
    expect(state.selectedGroup).toBeNull();
    expect(state.selectedGroupKey).toBeNull();
    expect(state.selectedGroupId).toBeNull();
    expect(state.allowedTags).toBeNull();
    expect(state.editMode).toBe(false);
    expect(state.isNewApp).toBe(false);
    expect(state.hideCompleted).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle setMainView action', () => {
    store.dispatch(setMainView('groups'));
    const state = store.getState().root;
    expect(state.mainView).toBe('groups');
  });

  it('should handle setAppCollection action', () => {
    const appCollection = [{ id: 1, name: 'App 1' }];
    store.dispatch(setAppCollection(appCollection));
    const state = store.getState().root;
    expect(state.appCollection).toEqual(appCollection);
  });

  it('should handle setAppGroups action', () => {
    const appGroups = [{ id: 1, name: 'Group 1' }];
    store.dispatch(setAppGroups(appGroups));
    const state = store.getState().root;
    expect(state.appGroups).toEqual(appGroups);
  });

  it('should handle setTotalCount action', () => {
    store.dispatch(setTotalCount(10));
    const state = store.getState().root;
    expect(state.totalCount).toBe(10);
  });

  it('should handle setPage action', () => {
    store.dispatch(setPage(2));
    const state = store.getState().root;
    expect(state.page).toBe(2);
  });

  it('should handle setPageCount action', () => {
    store.dispatch(setPageCount(5));
    const state = store.getState().root;
    expect(state.pageCount).toBe(5);
  });

  it('should handle setPageContent action', () => {
    const pageContent = [{ id: 1, content: 'Content 1' }];
    store.dispatch(setPageContent(pageContent));
    const state = store.getState().root;
    expect(state.pageContent).toEqual(pageContent);
  });

  it('should handle setInReverse action', () => {
    store.dispatch(setInReverse(true));
    const state = store.getState().root;
    expect(state.inReverse).toBe(true);
  });

  it('should handle setActiveFilter action', () => {
    store.dispatch(setActiveFilter('active'));
    const state = store.getState().root;
    expect(state.activeFilter).toBe('active');
  });

  it('should handle setFilteredList action', () => {
    const filteredList = [{ id: 1, name: 'Filtered App 1' }];
    store.dispatch(setFilteredList(filteredList));
    const state = store.getState().root;
    expect(state.filteredList).toEqual(filteredList);
  });

  it('should handle setSelectedApp action', () => {
    const selectedApp = { id: 1, name: 'Selected App 1' };
    store.dispatch(setSelectedApp(selectedApp));
    const state = store.getState().root;
    expect(state.selectedApp).toEqual(selectedApp);
  });

  it('should handle setSelectedAppKey action', () => {
    store.dispatch(setSelectedAppKey('app1'));
    const state = store.getState().root;
    expect(state.selectedAppKey).toBe('app1');
  });

  it('should handle setSelectedAppTags action', () => {
    const selectedAppTags = ['tag1', 'tag2'];
    store.dispatch(setSelectedAppTags(selectedAppTags));
    const state = store.getState().root;
    expect(state.selectedAppTags).toEqual(selectedAppTags);
  });

  it('should handle setSelectedAppGroups action', () => {
    const selectedAppGroups = ['group1', 'group2'];
    store.dispatch(setSelectedAppGroups(selectedAppGroups));
    const state = store.getState().root;
    expect(state.selectedAppGroups).toEqual(selectedAppGroups);
  });

  it('should handle setSelectedGroup action', () => {
    const selectedGroup = { id: 1, name: 'Selected Group 1' };
    store.dispatch(setSelectedGroup(selectedGroup));
    const state = store.getState().root;
    expect(state.selectedGroup).toEqual(selectedGroup);
  });

  it('should handle setSelectedGroupKey action', () => {
    store.dispatch(setSelectedGroupKey('group1'));
    const state = store.getState().root;
    expect(state.selectedGroupKey).toBe('group1');
  });

  it('should handle setSelectedGroupId action', () => {
    store.dispatch(setSelectedGroupId(1));
    const state = store.getState().root;
    expect(state.selectedGroupId).toBe(1);
  });

  it('should handle setAllowedTags action', () => {
    const allowedTags = ['tag1', 'tag2'];
    store.dispatch(setAllowedTags(allowedTags));
    const state = store.getState().root;
    expect(state.allowedTags).toEqual(allowedTags);
  });

  it('should handle setEditMode action', () => {
    store.dispatch(setEditMode(true));
    const state = store.getState().root;
    expect(state.editMode).toBe(true);
  });

  it('should handle setIsNewApp action', () => {
    store.dispatch(setIsNewApp(true));
    const state = store.getState().root;
    expect(state.isNewApp).toBe(true);
  });

  it('should handle setHideCompleted action', () => {
    store.dispatch(setHideCompleted(true));
    const state = store.getState().root;
    expect(state.hideCompleted).toBe(true);
  });

  it('should handle setIsLoading action', () => {
    store.dispatch(setIsLoading(true));
    const state = store.getState().root;
    expect(state.isLoading).toBe(true);
  });

  it('should handle setError action', () => {
    const error = 'An error occurred';
    store.dispatch(setError(error));
    const state = store.getState().root;
    expect(state.error).toBe(error);
  });

  it('should return the correct state using getState selector', () => {
    const state = getState();
    expect(state).toEqual(store.getState().root);
  });
});