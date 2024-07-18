import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import { useStore } from "store/store";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getAllApps,
  getAppPage,
  getApp,
  updateApp,
  addApp,
  deleteApp,
} from "api/appCollectionApi.js";
import { appModelInstallerFields } from "api/appModel";
import {
  useAppCollectionStore,
  usePageStore,
  useSelectionStore
} from "store/store";
import {
  findIndex,
  isStartOfPage,
  isEndOfPage,
  isNullOrEmpty,
  appHasInstaller
} from "utils/pageUtils";

const queryClient = useQueryClient();

const appCollectionStore = useAppCollectionStore();
const pageStore = usePageStore();
const selectionStore = useSelectionStore();

const { setAppCollection, saveUpdatedApp, saveNewApp } = appCollectionStore();
const { setPage, setPageCount, SetPageSize, setInReverse, setActiveFilter, setFilteredList } = pageStore();
const { setSelectedApp, setSelectedAppKey, setEditMode } = selectionStore();



const useClientManager = () => {






};

export {
  setAppCollection,
  saveUpdatedApp,
  saveNewApp,
  setPage,
  setPageCount,
  SetPageSize,
  setInReverse,
  setActiveFilter,
  setFilteredList,
  setSelectedApp,
  setSelectedAppKey,
  setEditMode
};