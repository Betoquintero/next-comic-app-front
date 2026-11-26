import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test@houseofheroes.dev';
const TEST_PASSWORD = 'Test1234';

test('login, save an event to the collection, and mark an issue as read', async ({ page }) => {
  await test.step('login', async () => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/profile\//);
  });

  await test.step('navigate to an event via the catalog', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: /explore dc comics reading order/i }).click();
    await expect(page).toHaveURL(/\/parts\/DC$/);

    await page.getByRole('link', { name: /view details for/i }).first().click();
    await expect(page).toHaveURL(/\/parts\/DC\//);

    await page.getByRole('link', { name: /view details for/i }).first().click();
    await expect(page).toHaveURL(/\/events\//);
  });

  await test.step('save the event to the collection', async () => {
    await page.getByRole('button', { name: 'Add Event to My Collection' }).click();
    await expect(page.getByText(/successfully added event to collection|already on user's collection/i)).toBeVisible();
  });

  await test.step('mark the first issue as read and confirm it persists', async () => {
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile\//);

    await page.getByRole('button', { name: 'Expand collection' }).first().click();

    const markReadButton = page.getByRole('button', { name: 'Mark as Read' }).first();
    await markReadButton.click();
    await expect(page.getByRole('button', { name: 'Mark as Unread' }).first()).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: 'Expand collection' }).first().click();
    await expect(page.getByRole('button', { name: 'Mark as Unread' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Mark as Unread' }).first().click();
    await expect(page.getByRole('button', { name: 'Mark as Read' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Delete event' }).first().click();
  });
});
