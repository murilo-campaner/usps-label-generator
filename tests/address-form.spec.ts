import { test, expect } from '@playwright/test';

test.describe('Address Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Limpar campos obrigatórios
    await page.getByPlaceholder('123 Main St').clear();
    await page.getByPlaceholder('New York').clear();
    await page.locator('select[name="fromAddress.state"]').selectOption('');
    await page.getByPlaceholder('12345').clear();

    // Submeter o formulário
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar se as mensagens de erro aparecem
    await expect(page.getByText('Street address is required')).toBeVisible();
    await expect(page.getByText('City is required')).toBeVisible();
    await expect(page.getByText('State is required')).toBeVisible();
    await expect(page.getByText('ZIP code must be in valid format (12345 or 12345-6789)')).toBeVisible();
  });

  test('should show validation error for invalid ZIP code format', async ({ page }) => {
    // Inserir ZIP code inválido
    await page.getByPlaceholder('12345').clear();
    await page.getByPlaceholder('12345').fill('1234');

    // Submeter o formulário
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar se a mensagem de erro do ZIP aparece
    await expect(page.getByText('ZIP code must be in valid format (12345 or 12345-6789)')).toBeVisible();
  });

  test('should accept valid ZIP code formats', async ({ page }) => {
    // Testar ZIP code válido simples
    await page.getByPlaceholder('12345').clear();
    await page.getByPlaceholder('12345').fill('12345');

    // Verificar que não há erro
    await expect(page.getByText('ZIP code must be in valid format')).not.toBeVisible();

    // Testar ZIP code válido com extensão
    await page.getByPlaceholder('12345').clear();
    await page.getByPlaceholder('12345').fill('12345-6789');

    // Verificar que não há erro
    await expect(page.getByText('ZIP code must be in valid format')).not.toBeVisible();
  });

  test('should allow optional street2 field to be empty', async ({ page }) => {
    // Limpar campo opcional
    await page.getByPlaceholder('Apt 4B').clear();

    // Submeter o formulário
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar que não há erro para o campo opcional
    await expect(page.getByText('Street address is required')).not.toBeVisible();
  });

  test('should enable button when form is valid', async ({ page }) => {
    // Verificar se o botão está habilitado por padrão (com valores válidos)
    const submitButton = page.getByRole('button', { name: 'Validate Addresses' });
    await expect(submitButton).toBeEnabled();
  });

  test('should show loading state when submitting', async ({ page }) => {
    // Mock da resposta da API para simular loading
    await page.route('**/api/verify-address', async route => {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isValid: true })
      });
    });

    // Submeter o formulário
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar se o botão mostra estado de loading
    await expect(page.getByRole('button', { name: 'Validating...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Validating...' })).toBeDisabled();
  });
});
