import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockState } from './mockStore'; // Import the mock setup
import * as selectors from './selectors';
import { filterModel } from 'api/filterApi';

describe('selectors', () => {
  beforeEach(() => {

  });

  it('should return app collection', () => {
    expect(selectors.getAppCollection).toEqual(mockState.appCollection);
  });

  it('should return page', () => {
    expect(selectors.getPage).toEqual(mockState.page);
  });

  it('should return page count', () => {
    expect(selectors.getPageCount).toEqual(mockState.pageCount);
  });

  it('should return page content', () => {
    expect(selectors.getPageContent).toEqual(mockState.pageContent);
  });

  it('should return page size', () => {
    expect(selectors.getPageSize).toEqual(mockState.pageSize);
  });

  it('should return in reverse', () => {
    expect(selectors.getInReverse).toEqual(mockState.inReverse);
  });

  it('should return filter model', () => {
    expect(selectors.getFilterModel).toEqual(mockState.filterModel);
  });

  it('should return active filter', () => {
    expect(selectors.getActiveFilter).toEqual(mockState.activeFilter);
  });

  it('should return selected app', () => {
    expect(selectors.getSelectedApp).toEqual(mockState.selectedApp);
  });

  it('should return selected app key', () => {
    expect(selectors.getSelectedAppKey).toEqual(mockState.selectedAppKey);
  });

  it('should return edit mode', () => {
    expect(selectors.getEditMode).toEqual(mockState.editMode);
  });

  it('should return search base', () => {
    const expected = [
      { id: 'app1', label: 'App 1', description: 'Short 1' },
      { id: 'app2', label: 'App 2', description: 'Short 2' },
    ];
    expect(selectors.getSearchBase()).toEqual(expected);
  });

  it('should return previous key', () => {
    expect(selectors.getPreviousKey()).toEqual('app1');
  });

  it('should return next key', () => {
    expect(selectors.getNextKey()).toEqual('app2');
  });

  it('should select page content', () => {
    const expected = [];
    expect(selectors.selectPageContent()).toEqual(expected);
  });

  it('should return current index', () => {
    expect(selectors.getCurrentIndex()).toEqual(0);
  });

  it('should select app by key', () => {
    expect(selectors.selectAppByKey('app1')).toEqual(mockState.appCollection[0]);
  });

  it('should throw error if app by key not found', () => {
    expect(() => selectors.selectAppByKey('nonexistent')).toThrow('App with key nonexistent not found');
  });

  it('should return app by id', () => {
    expect(selectors.getAppById(1)).toEqual(mockState.appCollection[0]);
  });

  it('should throw error if app by id not found', () => {
    expect(() => selectors.getAppById(999)).toThrow('App with id 999 not found');
  });

  it('should return selected group id', () => {
    expect(selectors.getSelectedGroupId()).toEqual(1);
  });
});