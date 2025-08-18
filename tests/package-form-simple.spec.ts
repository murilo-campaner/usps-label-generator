import { test, expect } from '@playwright/test';

test.describe('Package Form - Direct Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Mock da API de validação de endereço para sempre retornar sucesso
    await page.route('**/api/verify-address', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isValid: true })
      });
    });

    // Submeter o formulário de endereço com valores padrão
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Aguardar a transição para o formulário de pacote
    await expect(page.getByText('Package Information')).toBeVisible();
  });

  test('should display default values in package form fields', async ({ page }) => {
    // Verificar se os valores padrão estão preenchidos
    await expect(page.getByPlaceholder('16.0')).toHaveValue('16');
    await expect(page.getByPlaceholder('12.0')).toHaveValue('8');
    await expect(page.getByPlaceholder('8.0')).toHaveValue('6');
    await expect(page.locator('input[name="height"]')).toHaveValue('1');
  });

  // test('should show validation errors for zero or negative values', async ({ page }) => {
  //   // Inserir valores inválidos
  //   await page.getByPlaceholder('16.0').clear();
  //   await page.getByPlaceholder('16.0').fill('0');

  //   await page.getByPlaceholder('12.0').clear();
  //   await page.getByPlaceholder('12.0').fill('-1');

  //   // Submeter o formulário
  //   await page.getByRole('button', { name: 'Continue' }).click();

  //   // Verificar se as mensagens de erro aparecem
  //   await expect(page.getByText('Weight must be positive')).toBeVisible();
  //   await expect(page.getByText('Length must be positive')).toBeVisible();
  // });

  test('should show validation errors for values exceeding maximum limits', async ({ page }) => {
    // Inserir valores acima do máximo
    await page.getByPlaceholder('16.0').clear();
    await page.getByPlaceholder('16.0').fill('1001'); // > 1000 ounces

    await page.getByPlaceholder('12.0').clear();
    await page.getByPlaceholder('12.0').fill('201'); // > 200 inches

    // Submeter o formulário
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verificar se as mensagens de erro aparecem
    await expect(page.getByText('Weight cannot exceed 1000 ounces')).toBeVisible();
    await expect(page.getByText('Length cannot exceed 200 inches')).toBeVisible();
  });

  test('should accept valid decimal values', async ({ page }) => {
    // Inserir valores decimais válidos
    await page.getByPlaceholder('16.0').clear();
    await page.getByPlaceholder('16.0').fill('2.5');

    await page.getByPlaceholder('12.0').clear();
    await page.getByPlaceholder('12.0').fill('10.75');

    // Verificar que não há erros
    await expect(page.getByText('Weight must be positive')).not.toBeVisible();
    await expect(page.getByText('Length must be positive')).not.toBeVisible();
  });

  test('should handle empty input fields correctly', async ({ page }) => {
    // Limpar campos
    await page.getByPlaceholder('16.0').clear();
    await page.getByPlaceholder('12.0').clear();

    // Submeter o formulário
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verificar se as mensagens de erro aparecem (deve ser tratado como 0)
    await expect(page.getByText('Weight must be positive')).toBeVisible();
    await expect(page.getByText('Length must be positive')).toBeVisible();
  });

  test('should enable button when form is valid', async ({ page }) => {
    // Verificar se o botão está habilitado por padrão (com valores válidos)
    const submitButton = page.getByRole('button', { name: 'Continue' });
    await expect(submitButton).toBeEnabled();
  });

  test('should show loading state when submitting', async ({ page }) => {
    // Mock da resposta da API para simular loading
    await page.route('**/api/create-shipment', async route => {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          label: {
            url: 'https://example.com/label.pdf',
            format: 'PDF',
            trackingCode: 'TRACK123',
            rate: {
              service: 'Priority Mail',
              rate: 8.50,
              carrier: 'USPS'
            }
          }
        })
      });
    });

    // Submeter o formulário
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verificar se o botão mostra estado de loading
    await expect(page.getByRole('button', { name: 'Processing...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Processing...' })).toBeDisabled();
  });

  test('should display helpful tip about dimensions', async ({ page }) => {
    // Verificar se a dica sobre dimensões está visível
    await expect(page.getByText('Tip: Make sure the dimensions are accurate.')).toBeVisible();
    await expect(page.getByText('Incorrect dimensions may result in inaccurate shipping rates.')).toBeVisible();
  });

  test('should show conversion hint for weight', async ({ page }) => {
    // Verificar se a dica de conversão de peso está visível
    await expect(page.getByText('1 pound = 16 ounces')).toBeVisible();
  });
});
