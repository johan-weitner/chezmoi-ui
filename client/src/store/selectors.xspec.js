// import { vi } from 'vitest';
// import {
//   getAppCollection,
//   getPageContent,
//   getPageSize,
//   getInReverse,
//   getFilterModel,
//   getActiveFilter,
//   getFilteredList,
//   getSelectedApp,
//   getSelectedAppKey,
//   getEditMode,
//   memoizedSelectApp,
//   memoizedSelectAppByKey,
//   getPreviousKey,
//   getNextKey,
//   selectPageContent
// } from "./selectors";

// describe("Selectors", () => {
//   const state = {
//     appCollection: [{ key: "app1" }, { key: "app2" }],
//     pageContent: "Lorem ipsum dolor sit amet",
//     pageSize: 10,
//     inReverse: false,
//     filterModel: { name: "example" },
//     activeFilter: "example",
//     filteredList: [{ name: "example" }],
//     selectedApp: { key: "app1" },
//     selectedAppKey: "app1",
//     editMode: true,
//   };

//   describe("getAppCollection", () => {
//     it("should return the app collection from the state", () => {
//       const result = getAppCollection(state);
//       expect(result).toEqual([{ key: "app1" }, { key: "app2" }]);
//     });
//   });

//   describe("getPageContent", () => {
//     it("should return the page content from the state", () => {
//       const result = getPageContent(state);
//       expect(result).toEqual("Lorem ipsum dolor sit amet");
//     });
//   });

//   describe("getPageSize", () => {
//     it("should return the page size from the state", () => {
//       const result = getPageSize(state);
//       expect(result).toEqual(10);
//     });
//   });

//   describe("getInReverse", () => {
//     it("should return the 'inReverse' value from the state", () => {
//       const result = getInReverse(state);
//       expect(result).toEqual(false);
//     });
//   });

//   describe("getFilterModel", () => {
//     it("should return the filter model from the state", () => {
//       const result = getFilterModel(state);
//       expect(result).toEqual({ name: "example" });
//     });
//   });

//   describe("getActiveFilter", () => {
//     it("should return the active filter from the state", () => {
//       const result = getActiveFilter(state);
//       expect(result).toEqual("example");
//     });
//   });

//   describe("getSelectedApp", () => {
//     it("should return the selected app from the state", () => {
//       const result = getSelectedApp(state);
//       expect(result).toEqual({ key: "app1" });
//     });
//   });

//   describe("getSelectedAppKey", () => {
//     it("should return the selected app key from the state", () => {
//       const result = getSelectedAppKey(state);
//       expect(result).toEqual("app1");
//     });
//   });

//   describe("getEditMode", () => {
//     it("should return the edit mode from the state", () => {
//       const result = getEditMode(state);
//       expect(result).toEqual(true);
//     });
//   });

//   describe("memoizedSelectApp", () => {
//     it("should return the selected app from the app collection", () => {
//       const result = memoizedSelectApp(state);
//       expect(result).toEqual({ key: "app1" });
//     });
//   });


//   describe('memoizedSelectAppByKey', () => {
//     it('should return the app matching the provided key', () => {
//       const state = {
//         appCollection: [
//           { key: 'app1', name: 'Application 1' },
//           { key: 'app2', name: 'Application 2' },
//         ],
//       };
//       const selectedApp = memoizedSelectAppByKey(state, 'app2');
//       expect(selectedApp).toEqual({ key: 'app2', name: 'Application 2' });
//     });

//     it('should throw an error if no app matches the provided key', () => {
//       const state = {
//         appCollection: [
//           { key: 'app1', name: 'Application 1' },
//           { key: 'app2', name: 'Application 2' },
//         ],
//       };
//       expect(() => memoizedSelectAppByKey(state, 'app3')).toThrow();
//     });

//     it('should throw an error if the app collection is not provided', () => {
//       const state = {};
//       expect(() => memoizedSelectAppByKey(state, 'app1')).toThrow();
//     });
//   });


//   describe('selectPageContent', () => {
//     it('returns the first page correctly', () => {
//       const appCollection = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
//       const page = 1;
//       const pageSize = 10;
//       const result = selectPageContent.resultFunc(appCollection, page, pageSize);
//       expect(result).toEqual(appCollection.slice(0, 10));
//     });

//     it('returns a middle page correctly', () => {
//       const appCollection = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
//       const page = 5;
//       const pageSize = 10;
//       const result = selectPageContent.resultFunc(appCollection, page, pageSize);
//       expect(result).toEqual(appCollection.slice(40, 50));
//     });

//     it('returns the last page correctly, even if not full', () => {
//       const appCollection = Array.from({ length: 95 }, (_, i) => ({ id: i + 1 }));
//       const page = 10;
//       const pageSize = 10;
//       const result = selectPageContent.resultFunc(appCollection, page, pageSize);
//       expect(result).toEqual(appCollection.slice(90, 95));
//     });

//   });


//   // describe('getFilteredList', () => {
//   //   vi.mock('./selectors', () => ({
//   //     getActiveFilter: vi.fn(),
//   //     getAppCollection: vi.fn(),
//   //     getFilterModel: vi.fn(() => ({
//   //       validFilter: {
//   //         method: (apps) => apps.filter(app => app.id === 1),
//   //       },
//   //     })),
//   //   }));

//   //   it('returns filtered list based on the active filter', () => {
//   //     // Setup
//   //     getActiveFilter.mockReturnValue('validFilter');
//   //     getAppCollection.mockReturnValue([
//   //       { id: 1, name: 'App1' },
//   //       { id: 2, name: 'App2' },
//   //     ]);

//   //     // Execute
//   //     const state = {}; // Assuming state structure is handled within mocked functions
//   //     const filteredList = getFilteredList(state)(state);

//   //     // Assert
//   //     expect(filteredList).toEqual([{ id: 1, name: 'App1' }]);
//   //   });

//   //   it('returns an empty array when the filter is invalid', () => {
//   //     // Setup
//   //     getActiveFilter.mockReturnValue('invalidFilter');
//   //     getAppCollection.mockReturnValue([
//   //       { id: 1, name: 'App1' },
//   //       { id: 2, name: 'App2' },
//   //     ]);

//   //     // Execute
//   //     const state = {}; // Assuming state structure is handled within mocked functions
//   //     const filteredList = getFilteredList(state)(state);

//   //     // Assert
//   //     expect(filteredList).toEqual([]);
//   //   });
//   // });



//   // describe('Navigation selectors', () => {
//   //   const state = {
//   //     appCollection: [
//   //       { key: 'app1', name: 'Application 1' },
//   //       { key: 'app2', name: 'Application 2' },
//   //       { key: 'app3', name: 'Application 3' },
//   //     ]
//   //   };

//   //   const getCurrentIndex = vi.fn();
//   //   const getAppCollection = vi.fn().mockReturnValue(state.appCollection);

//   //   beforeEach(() => {
//   //     vi.resetAllMocks();
//   //   });

//   //   describe('getPreviousKey', () => {
//   //     it('should return the key of the previous app', () => {
//   //       getCurrentIndex.mockReturnValueOnce(2); // Assuming current index is 2 (app3)
//   //       expect(getPreviousKey(state)).toEqual('app2');
//   //     });

//   //     it('should return the first app key if the current app is the first one', () => {
//   //       getCurrentIndex.mockReturnValueOnce(0); // Assuming current index is 0 (app1)
//   //       expect(getPreviousKey(state)).toEqual('app1');
//   //     });
//   //   });

//   //   describe('getNextKey', () => {
//   //     it('should return the key of the next app', () => {
//   //       getCurrentIndex.mockReturnValueOnce(0); // Assuming current index is 0 (app1)
//   //       expect(getNextKey(state)).toEqual('app2');
//   //     });

//   //     it('should return the last app key if the current app is the last one', () => {
//   //       getCurrentIndex.mockReturnValueOnce(2); // Assuming current index is 2 (app3)
//   //       expect(getNextKey(state)).toEqual('app3');
//   //     });
//   //   });
//   // });

// });

