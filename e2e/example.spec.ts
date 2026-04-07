import { expect, test } from '@playwright/test';

test.describe('Admin dashboard login flow', () => {
  test('renders the login page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'ចូលគណនីរបស់អ្នក' })).toBeVisible();
    await expect(page.getByPlaceholder('ឈ្មោះ')).toBeVisible();
    await expect(page.getByPlaceholder('ពាក្យសម្ងាត់')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ចូលគណី' })).toBeVisible();
  });

  test('shows validation error for empty credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'ចូលគណី' }).click();
    await expect(page.getByText('សូមបញ្ចូល ឈ្មោះ')).toBeVisible();
  });

  test('logs in and redirects to dashboard with mocked API', async ({ page }) => {
    await page.route('**/admin/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-access-token',
          refresh_token: 'fake-refresh-token',
        }),
      });
    });

    await page.route('**/admin/overview*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          stats: {
            total_bookings: 1,
            pending: 0,
            approved: 1,
            completed: 0,
            cancelled: 0,
            total_revenue: 100,
          },
          bookings: [],
        }),
      });
    });

    await page.goto('/');

    await page.getByPlaceholder('ឈ្មោះ').fill('admin');
    await page.getByPlaceholder('ពាក្យសម្ងាត់').fill('password123');
    await page.getByRole('button', { name: 'ចូលគណី' }).click();

    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByText('ថ្ងៃជ្រើសរើស:')).toBeVisible();
  });
});
