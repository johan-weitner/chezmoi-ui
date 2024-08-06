// @ts-check
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });




test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByRole('button', { name: 'Adobe Creative Cloud' }).click();
  await expect(page.getByTitle('Open homepage in new window')).toHaveText('Adobe Creative Cloud');

  // await page.getByTitle('Open homepage in new window').click();
  // await page.getByRole('button', { name: 'Edit' }).click();
  // await page.getByRole('dialog').getByRole('heading', { name: 'Adobe Creative Cloud' }).click();
  // await page.getByRole('button', { name: 'Cancel' }).click();
  // await page.getByRole('button', { name: '2' }).click();
  // await page.getByText('Page 2 of 55 ⋅ 1097 apps in').click();
});


// test('test', async ({ page }) => {
//   await page.goto('http://localhost:8000/');
//   await page.getByRole('button', { name: 'Act' }).click();
//   await page.getByRole('button', { name: 'Edit' }).click();
//   await page.getByLabel('Key').click();
//   await page.getByLabel('Key').fill('actt');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await page.getByRole('button', { name: 'Act' }).click();
//   await page.getByRole('button', { name: 'Edit' }).click();
//   await page.getByRole('button', { name: 'Cancel' }).click();
//   await page.getByLabel('Add new app').click();
//   await page.getByLabel('Name').click();
//   await page.getByLabel('Name').fill('testing');
//   await page.getByLabel('Key').click();
//   await page.getByLabel('Key').fill('testing');
//   await page.getByLabel('Homepage').click();
//   await page.getByLabel('Homepage').fill('testing');
//   await page.getByRole('group', { name: 'Group memberships' }).getByPlaceholder('Pick tag from list').click();
//   await page.getByRole('option', { name: 'AI', exact: true }).click();
//   await page.getByRole('option', { name: 'AI-Desktop' }).click();
//   await page.getByRole('group', { name: 'Group memberships' }).getByPlaceholder('Pick tag from list').press('Escape');
//   await page.getByRole('group', { name: 'Tags' }).getByPlaceholder('Pick tag from list').click();
//   await page.getByRole('option', { name: 'dev' }).click();
//   await page.getByRole('option', { name: 'win' }).click();
//   await page.getByRole('group', { name: 'Tags' }).getByPlaceholder('Pick tag from list').press('Escape');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await page.locator('button:nth-child(7)').click();
//   await page.getByRole('button', { name: 'testing' }).click();
//   await page.getByRole('button', { name: 'Edit' }).click();
//   await page.getByRole('banner').getByRole('button').click();
//   await page.locator('.m_4081bf90 > button').first().click();
//   await page.getByLabel('Open filter menu').click();
//   await page.getByRole('menuitem', { name: 'Apps without installers' }).click();
//   await page.getByLabel('Open filter menu').click();
//   await page.getByRole('menuitem', { name: 'Apps without URLs' }).click();
//   await page.getByLabel('Open filter menu').click();
//   await page.getByRole('menuitem', { name: 'Restore filter' }).click();
//   await page.getByRole('group').getByRole('button').click();
//   await page.locator('[data-test="search-input"]').fill('dev');
//   await page.getByText('devbox').click();
//   await page.getByLabel('Export YAML file').click();
//   await page.getByRole('row', { name: 'cli' }).getByRole('checkbox').check();
//   await page.getByRole('row', { name: 'dev' }).getByRole('checkbox').check();
//   await page.getByRole('button', { name: 'Cancel' }).click();
// });