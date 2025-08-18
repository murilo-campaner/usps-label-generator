import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page with title', async ({ page }) => {
    await page.goto('/');

    // Verificar se o título da página está presente
    await expect(page.getByRole('heading', { name: 'USPS Label Generator' })).toBeVisible();

    // Verificar se a descrição está presente
    await expect(page.getByText('Create and print USPS shipping labels quickly and easily')).toBeVisible();
  });

  test('should show address form as first step', async ({ page }) => {
    await page.goto('/');

    // Verificar se o formulário de endereço está visível
    await expect(page.getByText('From Address')).toBeVisible();
    await expect(page.getByText('To Address')).toBeVisible();

    // Verificar se o botão de validação está presente
    await expect(page.getByRole('button', { name: 'Validate Addresses' })).toBeVisible();
  });

  test('should show progress steps', async ({ page }) => {
    await page.goto('/');

    // Verificar se os passos do progresso estão visíveis
    await expect(page.getByText('Addresses', { exact: true })).toBeVisible();
    await expect(page.getByText('Package', { exact: true })).toBeVisible();
    await expect(page.getByText('Label', { exact: true })).toBeVisible();
  });
});
