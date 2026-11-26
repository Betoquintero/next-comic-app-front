import { test, expect } from '@playwright/test';

test('registers a new account and shows the verification prompt', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e+${unique}@houseofheroes.dev`;

  await page.goto('/signup');

  await page.getByLabel('Username').fill(`e2e-user-${unique}`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('E2ePassword1');
  await page.getByLabel('Repeat the password').fill('E2ePassword1');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText(/please check your email to verify your account/i)).toBeVisible();
});
