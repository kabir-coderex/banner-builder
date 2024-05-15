import { test, expect } from '@playwright/test';

test('Site works', async ({ page }) => {
	await page.goto( '/wp-login.php' )

	const heading = page.getByRole( 'heading', { name: 'Powered by WordPress' } )

	// Expect a title "to contain" a substring.
	await expect( heading ).toBeVisible()
});
