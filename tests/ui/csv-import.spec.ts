import { expect, test, Page } from '@playwright/test';
import path from 'node:path';
import { credentials } from '../support/api';

const fixture = (name: string) => path.join(__dirname, '../fixtures', name);

async function loginAs(page: Page, username: 'buyer1' | 'seller1' | 'seller2'): Promise<void> {
  const account = credentials[username];
  await page.goto('login');
  await page.getByRole('textbox', { name: 'Username' }).fill(account.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(account.password);
  await page.getByRole('button', { name: 'Log in' }).click();
}

async function upload(page: Page, filename: string): Promise<string> {
  await page.locator('input[type="file"]').setInputFiles(fixture(filename));
  await page.getByRole('button', { name: 'Upload' }).click();
  return page.locator('main').innerText();
}

async function findProductRow(page: Page, sku: string): Promise<string> {
  for (let pageNo = 0; pageNo < 10; pageNo += 1) {
    const rows = (await page.getByRole('table').innerText()).split('\n');
    const match = rows.find((row) => row.includes(sku));
    if (match) return match;
    const next = page.getByRole('link', { name: 'Next' });
    if ((await next.count()) === 0) break;
    await next.click();
  }
  return '';
}

test.describe('Seller CSV import and cross-seller regression @regression', () => {
  test('CSV-01 imports a valid file and shows its row', async ({ page }) => {
    await loginAs(page, 'seller2');
    await page.goto('seller/products');
    const result = await upload(page, 'csv-regression-valid.csv');
    expect(result).toContain('Import complete: 1 rows, 0 errors');
    expect(await findProductRow(page, 'SKU-QA-20261115')).toContain('QA Regression Sample');
  });

  test('CSV-02 updates a same-seller SKU without duplicating it', async ({ page }) => {
    await loginAs(page, 'seller2');
    await page.goto('seller/products');
    const result = await upload(page, 'csv-regression-update.csv');
    expect(result).toContain('Import complete: 1 rows, 0 errors');
    const matches = await findProductRow(page, 'SKU-QA-20261115');
    expect(matches).toContain('QA Regression Sample Updated');
    expect(matches).toContain('₹12.00');
  });

  test('CSV-03 permits the same SKU under separate sellers and CAT-06 keeps both visible', async ({ page }) => {
    await loginAs(page, 'seller1');
    await page.goto('seller/products');
    expect(await upload(page, 'csv-regression-seller1.csv')).toContain('Import complete: 1 rows, 0 errors');

    await loginAs(page, 'buyer1');
    await page.goto('catalogue?q=SKU-QA-20261115&category=');
    const table = page.getByRole('table');
    await expect(table).toContainText('QA Regression Sample Seller 1');
    await expect(table).toContainText('QA Regression Sample Updated');
  });

  test('CSV-04 imports valid rows and reports invalid rows with line details', async ({ page }) => {
    await loginAs(page, 'seller2');
    await page.goto('seller/products');
    const result = await upload(page, 'csv-regression-mixed.csv');
    expect(result).toMatch(/Import complete:\s*1 rows,\s*1 errors/i);
    expect(result).toMatch(/line 3/i);
    expect(result).toMatch(/tax/i);
  });

  test('CSV-05 rejects invalid tax, stock, case size and prices with row reasons', async ({ page }) => {
    await loginAs(page, 'seller2');
    await page.goto('seller/products');
    const result = await upload(page, 'csv-regression-invalid.csv');
    expect(result).toMatch(/Import complete:\s*0 rows,\s*4 errors/i);
    for (const line of [2, 3, 4, 5]) expect(result).toMatch(new RegExp(`line ${line}`, 'i'));
  });

  test('CSV-06 preserves Unicode and punctuation through import and catalogue display', async ({ page }) => {
    await loginAs(page, 'seller1');
    await page.goto('seller/products');
    expect(await upload(page, 'csv-regression-unicode.csv')).toContain('Import complete: 1 rows, 0 errors');
    const row = await findProductRow(page, 'SKU-QA-20261115');
    expect(row).toContain('नमस्ते QA, मसाला!');

    await loginAs(page, 'buyer1');
    await page.goto('catalogue?q=SKU-QA-20261115&category=');
    await expect(page.getByRole('table')).toContainText('नमस्ते QA, मसाला!');
  });

  test('CSV-07 rejects a missing header and accepts reordered named columns', async ({ page }) => {
    await loginAs(page, 'seller1');
    await page.goto('seller/products');
    const missing = await upload(page, 'csv-regression-missing-column.csv');
    expect(missing).toContain('CSV must have columns');
    expect(missing).toContain('stock');

    const reordered = await upload(page, 'csv-regression-reordered.csv');
    expect(reordered).toContain('Import complete: 1 rows, 0 errors');
    expect(await findProductRow(page, 'SKU-QA-REORDER-20261115')).toContain('QA Reordered Header Sample');
  });
});
