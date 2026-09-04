import { test, expect } from '@playwright/test';

// Signup creates the user but the backend requires clicking a Resend email
// verification link before /auth/login accepts it — nothing this test can
// automate. Scope is therefore limited to: the form works, and the backend
// really accepts the registration (real POST /auth/signup, no mocks).
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
