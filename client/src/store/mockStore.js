import { vi } from 'vitest';
import { filterModel } from 'api/filterApi';

const mockState = {
  appCollection: [
    { id: 1, key: 'app1', name: 'App 1', short: 'Short 1' },
    { id: 2, key: 'app2', name: 'App 2', short: 'Short 2' },
  ],
  page: 1,
  pageCount: 2,
  pageContent: [
    {
      id: 1,
      key: 'app1',
      name: 'App 1',
      short: 'Short 1',
      tags: ['tag1'],
      groups: ['group1']
    },
    {
      id: 2,
      key: 'app2',
      name: 'App 2',
      short: 'Short 2',
      tags: ['tag2'],
      groups: ['group2']
    }
  ],
  pageSize: 20,
  inReverse: false,
  filterModel: { ...filterModel },
  activeFilter: 'all',
  selectedApp: { id: 1, key: 'app1' },
  selectedAppKey: 'app1',
  editMode: false,
  totalCount: 2,
  selectedGroupKey: 'group1',
  appGroups: [{ name: 'group1', id: 1 }],
};

vi.mock('store/store', () => ({
  getState: vi.fn(() => mockState),
  store: {
    dispatch: vi.fn()
  },
  setSelectedAppKey: vi.fn(),
  filterModel: vi.importActual('api/filterApi').filterModel,
  setPageContent: vi.fn(),
  setPage: vi.fn(),
}));

export { mockState };


// import { vi } from 'vitest';
// import { getState } from 'store/store';
// import { filterModel } from 'api/filterApi';

// const mockState = {
//   appCollection: [
//     { id: 1, key: 'app1', name: 'App 1', short: 'Short 1' },
//     { id: 2, key: 'app2', name: 'App 2', short: 'Short 2' },
//   ],
//   page: 1,
//   pageCount: 2,
//   pageContent: [],
//   pageSize: 20,
//   inReverse: false,
//   filterModel: { ...filterModel },
//   activeFilter: 'all',
//   selectedApp: { id: 1, key: 'app1' },
//   selectedAppKey: 'app1',
//   editMode: false,
//   totalCount: 2,
//   selectedGroupKey: 'group1',
//   appGroups: [{ name: 'group1', id: 1 }],
// };

// vi.mock('store/store', () => ({
//   getState: vi.fn(() => mockState),
//   store: {
//     dispatch: vi.fn()
//   },
//   setSelectedAppKey: vi.fn(),
//   filterModel: vi.importActual('api/filterApi').filterModel,
// }));

// export { mockState };