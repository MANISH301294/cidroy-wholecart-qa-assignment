import { expect, test } from '@playwright/test';
import { credentials } from '../support/api';

test.describe('Login UI', () => {
  test('invalid credentials do not enter the application', async ({ page }) => {
    await page.goto('login');
    await page.getByRole('textbox', { name: 'Username' }).fill('wholecart-invalid-user');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong-password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  });

  test('empty credentials do not enter the application', async ({ page }) => {
    await page.goto('login');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  });

  for (const role of ['buyer1', 'seller1', 'operator'] as const) {
    test(`${role} can sign in`, async ({ page }) => {
      await page.goto('login');
      await page.getByRole('textbox', { name: 'Username' }).fill(credentials[role].username);
      await page.getByRole('textbox', { name: 'Password' }).fill(credentials[role].password);
      await page.getByRole('button', { name: 'Log in' }).click();
      await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/);
    });
  }
});
