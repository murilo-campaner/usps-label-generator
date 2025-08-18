import { test, expect } from '@playwright/test';

test.describe('Complete User Flow', () => {
  test('should complete full shipping label generation flow', async ({ page }) => {
    await page.goto('/');

    // Mock das APIs
    await page.route('**/api/verify-address', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ isValid: true })
      });
    });

    await page.route('**/api/create-shipment', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true,
          label: {
            url: 'https://example.com/label.pdf',
            format: 'PDF',
            trackingCode: 'TRACK123456789',
            rate: {
              service: 'Priority Mail',
              rate: 8.50,
              carrier: 'USPS'
            },
            trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=TRACK123456789'
          }
        })
      });
    });

    // Etapa 1: Preencher endereços
    // Modificar alguns campos para testar a funcionalidade
    await page.getByPlaceholder('123 Main St').clear();
    await page.getByPlaceholder('123 Main St').fill('123 Test Street');
    
    await page.getByPlaceholder('456 Oak Ave').clear();
    await page.getByPlaceholder('456 Oak Ave').fill('456 Delivery Avenue');

    // Submeter endereços
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Aguardar transição para formulário de pacote
    await expect(page.getByText('Package Information')).toBeVisible();
    await expect(page.getByText('Addresses validated successfully!')).toBeVisible();

    // Etapa 2: Preencher informações do pacote
    await page.getByPlaceholder('16.0').clear();
    await page.getByPlaceholder('16.0').fill('24.5'); // 1.5 pounds
    
    await page.getByPlaceholder('12.0').clear();
    await page.getByPlaceholder('12.0').fill('12.0');
    
    await page.getByPlaceholder('8.0').clear();
    await page.getByPlaceholder('8.0').fill('8.0');
    
    await page.locator('input[name="height"]').clear();
    await page.locator('input[name="height"]').fill('2.0');

    // Submeter informações do pacote
    await page.getByRole('button', { name: 'Continue' }).click();

    // Aguardar transição para visualização do label
    await expect(page.getByText('Label generated successfully!')).toBeVisible();
    await expect(page.getByText('TRACK123456789')).toBeVisible();
    await expect(page.getByText('Priority Mail')).toBeVisible();
    await expect(page.getByText('$8.50')).toBeVisible();

    // Verificar se o botão de download está presente
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();

    // Testar botão "Create New Label"
    await page.getByRole('button', { name: 'Create New Label' }).click();

    // Verificar se voltou para o primeiro passo
    await expect(page.getByText('From Address')).toBeVisible();
    await expect(page.getByText('To Address')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Mock de erro na validação de endereço
    await page.route('**/api/verify-address', async route => {
      await route.fulfill({ 
        status: 400, 
        contentType: 'application/json',
        body: JSON.stringify({ 
          error: 'Invalid address format',
          errors: ['Street address not found', 'Invalid ZIP code']
        })
      });
    });

    // Submeter endereços
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar se a mensagem de erro aparece
    await expect(page.getByText('Invalid address format')).toBeVisible();
    await expect(page.getByText('Street address not found, Invalid ZIP code')).toBeVisible();

    // Verificar que ainda está no primeiro passo
    await expect(page.getByText('From Address')).toBeVisible();
  });

  test('should handle network errors', async ({ page }) => {
    await page.goto('/');

    // Mock de erro de rede
    await page.route('**/api/verify-address', async route => {
      await route.abort('failed');
    });

    // Submeter endereços
    await page.getByRole('button', { name: 'Validate Addresses' }).click();

    // Verificar se a mensagem de erro genérica aparece
    await expect(page.getByText('Error validating addresses.')).toBeVisible();
  });

  test('should allow navigation back to previous steps', async ({ page }) => {
    await page.goto('/');

    // Mock da API de validação
    await page.route('**/api/verify-address', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ isValid: true })
      });
    });

    // Avançar para o formulário de pacote
    await page.getByRole('button', { name: 'Validate Addresses' }).click();
    await expect(page.getByText('Package Information')).toBeVisible();

    // Voltar para o formulário de endereços
    await page.getByRole('button', { name: '← Back to addresses' }).click();

    // Verificar se voltou para o formulário de endereços
    await expect(page.getByText('From Address')).toBeVisible();
    await expect(page.getByText('To Address')).toBeVisible();
  });

  test('should show progress indicators correctly', async ({ page }) => {
    await page.goto('/');

    // Verificar estado inicial - passo 1 ativo
    await expect(page.locator('div:has-text("1")').first()).toHaveClass(/border-blue-600/);
    await expect(page.locator('div:has-text("2")').first()).toHaveClass(/border-gray-300/);
    await expect(page.locator('div:has-text("3")').first()).toHaveClass(/border-gray-300/);

    // Mock da API e avançar para passo 2
    await page.route('**/api/verify-address', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ isValid: true })
      });
    });

    await page.getByRole('button', { name: 'Validate Addresses' }).click();
    await expect(page.getByText('Package Information')).toBeVisible();

    // Verificar que o passo 2 está ativo
    await expect(page.locator('div:has-text("1")').first()).toHaveClass(/border-blue-600/);
    await expect(page.locator('div:has-text("2")').first()).toHaveClass(/border-blue-600/);
    await expect(page.locator('div:has-text("3")').first()).toHaveClass(/border-gray-300/);
  });
});
