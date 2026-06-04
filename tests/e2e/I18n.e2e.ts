import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from Spanish to English using dropdown and verify text on the homepage', async ({
      page,
    }) => {
      await page.goto('/');

      await expect(
        page.getByRole('link', {
          name: 'Inicio',
        }),
      ).toBeVisible();

      await page.getByLabel('Cambiar idioma').selectOption('en');

      await expect(
        page.getByRole('link', {
          name: 'Home',
        }),
      ).toBeVisible();
    });

    test('should switch language from Spanish to English using URL and verify text on the sign-in page', async ({
      page,
    }) => {
      await page.goto('/sign-in');

      await expect(page.getByText('Dirección de correo electrónico')).toBeVisible();

      await page.goto('/en/sign-in');

      await expect(page.getByText('Email address')).toBeVisible();
    });
  });
});
