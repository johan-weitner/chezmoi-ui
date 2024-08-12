import { describe, it, expect, vi } from 'vitest';
import { getYamlExport, getFilteredYamlExport, getInstallDoctorExport } from './export.js';
import { getAllAppsWithTags, getAppsByTag, getGroupedApplications } from '../db/dbService.js';
import { log } from './logger.js';

vi.mock('../db/dbService.js');
vi.mock('./logger.js');

describe('export.js', () => {

	describe('getYamlExport', () => {
		it('should fetch all apps with tags and format them as YAML', async () => {
			const mockApps = [{ key: 'app1', name: 'App 1', appTags: [{ name: 'tag1' }] }];
			getAllAppsWithTags.mockResolvedValue(mockApps);

			const result = await getYamlExport();

			expect(getAllAppsWithTags).toHaveBeenCalled();
			expect(log.debug).toHaveBeenCalledWith(mockApps);
			expect(result).toEqual({
				softwarePackages: [
					{
						app1: {
							name: 'App 1',
							tags: ['tag1'],
							// other properties omitted for brevity
						},
					},
				],
			});
		});
	});

	describe('getFilteredYamlExport', () => {
		it('should fetch apps by tags and format them as YAML', async () => {
			const mockTags = ['tag1'];
			const mockApps = [{ key: 'app1', name: 'App 1', appTags: [{ name: 'tag1' }] }];
			getAppsByTag.mockResolvedValue(mockApps);

			const result = await getFilteredYamlExport(mockTags);

			expect(getAppsByTag).toHaveBeenCalledWith(mockTags);
			expect(log.debug).toHaveBeenCalledWith('Export: Filtered apps: ', mockApps.length);
			expect(result).toEqual({
				softwarePackages: [
					{
						app1: {
							name: 'App 1',
							tags: ['tag1'],
							// other properties omitted for brevity
						},
					},
				],
			});
		});
	});

	describe('getInstallDoctorExport', () => {
		it('should fetch grouped applications and format them as YAML', async () => {
			const mockGroups = [{ name: 'Group 1', Application: [{ name: 'App 1' }] }];
			getGroupedApplications.mockResolvedValue(mockGroups);

			const result = await getInstallDoctorExport();

			expect(getGroupedApplications).toHaveBeenCalled();
			expect(log.info).toHaveBeenCalledWith('Groups: ', mockGroups.length);
			expect(result).toEqual({
				softwareGroups: [
					{
						'Group 1': ['App 1'],
					},
				],
			});
		});
	});

});