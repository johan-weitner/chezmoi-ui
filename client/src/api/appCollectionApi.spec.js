import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import {
	fetchApps,
	fetchUnfinishedApps,
	fetchFilteredApps,
	fetchAppPage,
	getPageSlice,
	fetchApp,
	updateApp,
	saveNewApp,
	deleteApp,
	markAppDone,
} from './appCollectionApi';
import { useClientManager } from 'core/ClientManager';
import { mapEntityToDb, transformNullValues } from "./helpers";
import { log } from 'utils/logger';

vi.mock('axios');
vi.mock('core/ClientManager');
vi.mock('utils/logger');

const BASE_URL = "http://localhost:3000";

describe('appCollectionApi', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('fetchApps should return data on success', async () => {
		const mockData = [{ id: 1, name: 'App1' }];
		axios.get.mockResolvedValue({ data: mockData });

		const result = await fetchApps();
		expect(result).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/software`);
	});

	it('fetchApps should throw error on failure', async () => {
		axios.get.mockRejectedValue(new Error('Network Error'));

		await expect(fetchApps()).rejects.toThrow('Network Error');
	});

	it('fetchUnfinishedApps should return data on success', async () => {
		const mockData = [{ id: 1, name: 'App1' }];
		axios.get.mockResolvedValue({ data: mockData });

		const result = await fetchUnfinishedApps();
		expect(result).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/softwareNotDone`);
	});

	it('fetchFilteredApps should return data on success', async () => {
		const mockData = [{ id: 1, name: 'App1' }];
		axios.get.mockResolvedValue({ data: mockData });

		const result = await fetchFilteredApps('test');
		expect(result).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/filterBy?filter=test`);
	});

	it('fetchAppPage should return paginated data', async () => {
		const mockData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
		axios.get.mockResolvedValue({ data: mockData });

		const result = await fetchAppPage(2, 10);
		expect(result).toEqual(mockData.slice(10, 20));
	});

	it('fetchApp should return transformed data', async () => {
		const mockData = { id: 1, name: 'App1' };
		axios.get.mockResolvedValue({ data: mockData });

		const result = await fetchApp('key1');
		expect(result).toEqual(transformNullValues(mockData));
		expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/getApp?key=key1`);
	});

	it('updateApp should post data and return response', async () => {
		const mockData = { id: 1, name: 'Updated App' };
		axios.post.mockResolvedValue({ data: mockData });
		useClientManager.mockReturnValue({ getGroupId: vi.fn().mockReturnValue(1) });

		const result = await updateApp(mockData, ['tag1'], ['group1']);
		expect(result).toEqual(mockData);
		expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/updateNode`, {
			...mockData,
			appTags: ['tag1'],
			appGroups: [1]
		});
	});

	it('saveNewApp should post data and return response', async () => {
		const mockData = { id: 1, name: 'New App', appTags: [1], appGroups: ["3"] };
		axios.post.mockResolvedValue({ data: mockData });
		useClientManager.mockReturnValue({ getGroupId: vi.fn().mockReturnValue(1) });

		const result = await saveNewApp(mockData);
		expect(result).toEqual(mockData);
		expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/addNode`, {
			data: {
				...transformNullValues(mapEntityToDb(mockData)),
				appTags: mockData.appTags,
				appGroups: [1],
				edited: true
			}
		});
	});

	it('deleteApp should delete data and return response', async () => {
		const mockData = { success: true };
		axios.delete.mockResolvedValue({ data: mockData });

		const result = await deleteApp(1);
		expect(result).toEqual(mockData);
		expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/deleteNode`, {
			params: { id: 1 }
		});
	});

	it('markAppDone should update app and return response', async () => {
		const mockData = { id: 1, done: true };
		axios.post.mockResolvedValue({ data: mockData });

		const result = await markAppDone(mockData);
		console.log("RESULT: ", result);
		expect(result).toEqual(mockData);
	});

	it('getPageSlice should return correct slice of data', () => {
		const mockData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
		const result = getPageSlice(2, 10, mockData);
		expect(result).toEqual(mockData.slice(10, 20));
	});
});