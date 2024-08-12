import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import YAML from 'yaml';
import { tags } from '../db/fixtures/tags.js';
import {
	getCount,
	getTagCount,
	isEmptyDb,
	isEmptyTagsTable,
	seedDb,
	seedTags,
	seedGroups,
	getGroupCount,
	getAllGroups
} from '../db/dbService.js';
import { styles } from '../util/styles.js';
import { softwareYamlPath, softwareGroupYamlPath } from './config.js';
import { printAppLogo } from './logo.js';
import { log } from '../util/log.js';
import {
	initialize, setupGroupData, mapDataSeed, _checkEnvVars, _checkFileExistence,
	_seedDbIfEmpty, doSeedGroups, doSeedTags, _setupFileData
} from './boot.js';
import { mockApp, mockAppSrc, mockGroups } from './mockData.js';

vi.mock('node:fs');
vi.mock('yaml');
vi.mock('../db/dbService.js');
vi.mock('../util/styles.js');
vi.mock('./config.js', () => ({
	softwareYamlPath: `.${import.meta.env.SOURCE_FILE}`,
	softwareGroupYamlPath: `.${import.meta.env.SOURCE_GRP_FILE}`
}));

describe('boot.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('_checkEnvVars', () => {
		it('should exit process if environment variables are missing', () => {
			vi.spyOn(process, 'exit').mockImplementation(() => { });
			vi.mock('./config.js', () => ({
				softwareYamlPath: undefined,
				softwareGroupYamlPath: undefined
			}));
			_checkEnvVars();
			expect(process.exit).toHaveBeenCalledWith(1);
		});
	});

	describe('_checkFileExistence', () => {
		it('should exit process if files do not exist', () => {
			vi.spyOn(process, 'exit').mockImplementation(() => { });
			fs.existsSync.mockReturnValue(false);
			_checkFileExistence();
			expect(process.exit).toHaveBeenCalledWith(1);
		});

		it('should return sourceExists as true if files exist', () => {
			fs.existsSync.mockReturnValue(true);
			const result = _checkFileExistence();
			expect(result.sourceExists).toBe(true);
		});
	});

	describe('mapDataSeed', () => {
		it('should map source data to data model', async () => {
			const keys = Object.keys(mockAppSrc);
			const expectedResults = [mockApp];
			const mappedData = mapDataSeed(keys, mockAppSrc);
			expect(mappedData).toEqual(expectedResults);
		});
	});

	describe('_seedDbIfEmpty', () => {
		it('should seed the database if it is empty', async () => {
			getCount.mockResolvedValue(10);
			isEmptyDb.mockResolvedValue(true);
			getTagCount.mockResolvedValue(0);
			const _setupFileData = vi.fn().mockReturnValue(mockGroups);

			fs.readFileSync.mockReturnValue('softwarePackages: mockGroups');
			YAML.parse.mockReturnValue({ softwarePackages: mockGroups });
			await _seedDbIfEmpty();
			expect(seedDb).toHaveBeenCalled();
		});
	});

	// describe('doSeedGroups', () => {
	// 	it('should seed groups', async () => {
	// 		fs.readFileSync.mockReturnValue('softwareGroups: {}');
	// 		YAML.parse.mockReturnValue({ softwareGroups: {} });
	// 		await doSeedGroups();
	// 		expect(seedGroups).toHaveBeenCalled();
	// 	});
	// });

	// describe('doSeedTags', () => {
	// 	it('should seed tags', async () => {
	// 		await doSeedTags();
	// 		expect(seedTags).toHaveBeenCalledWith(tags);
	// 	});
	// });
});