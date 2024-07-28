import { test, expect } from "@playwright/test";

test('has pagination', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await expect(page).toHaveTitle(/Chezmoi UI/);
  await expect(page.getByTestId('pagination')).toBeVisible();
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.locator('button:nth-child(10)').click();
  await page.locator('.m_4081bf90 > button:nth-child(2)').click();
  await page.locator('button:nth-child(11)').click();
  await page.locator('._pagination_1hk6h_1 > .m_4081bf90 > button').first().click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '2', exact: true }).press('Alt+ArrowRight');
  await page.getByRole('button', { name: '2', exact: true }).press('Alt+ArrowLeft');
});

test('test', async ({ page }) => {
  await page.getByRole('group').getByRole('button').click();
  await page.getByPlaceholder('Search apps...').fill('dev');
  await page.locator('.mantine-Spotlight-overlay').click();
  await page.getByLabel('Open filter menu').click();
  await page.getByRole('menuitem', { name: 'Apps without installers' }).click();
  await page.getByLabel('Open filter menu').click();
  await page.getByRole('menuitem', { name: 'Apps without URLs' }).click();
  await page.getByLabel('Open filter menu').click();
  await page.getByRole('menuitem', { name: 'Apps without name' }).click();
  await page.getByLabel('Open filter menu').click();
  await page.getByRole('menuitem', { name: 'Apps without description' }).click();
  await page.getByLabel('Open filter menu').click();
  await page.getByRole('menuitem', { name: 'Restore filter' }).click();
});