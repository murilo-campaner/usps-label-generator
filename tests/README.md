# Testes do USPS Label Generator

Este diretório contém os testes automatizados para o USPS Label Generator usando Playwright.

## Estrutura dos Testes

- `home.spec.ts` - Testes da página inicial e componentes básicos
- `address-form.spec.ts` - Testes específicos do formulário de endereço
- `package-form.spec.ts` - Testes específicos do formulário de pacote
- `complete-flow.spec.ts` - Testes de fluxo completo do usuário

## Como Executar os Testes

### Pré-requisitos

Certifique-se de que todas as dependências estão instaladas:

```bash
npm install
```

### Comandos Disponíveis

1. **Executar todos os testes:**
   ```bash
   npm test
   ```

2. **Executar testes com interface visual:**
   ```bash
   npm run test:ui
   ```

3. **Executar testes em modo headed (com navegador visível):**
   ```bash
   npm run test:headed
   ```

4. **Executar testes em modo debug:**
   ```bash
   npm run test:debug
   ```

### Executar Testes Específicos

Para executar apenas um arquivo de teste:

```bash
npx playwright test home.spec.ts
```

Para executar apenas um teste específico:

```bash
npx playwright test --grep "should load the home page"
```

## Configuração

O Playwright está configurado para:

- Executar testes em paralelo
- Usar múltiplos navegadores (Chromium, Firefox, WebKit)
- Iniciar automaticamente o servidor de desenvolvimento
- Gerar relatórios HTML
- Coletar traces em caso de falha

## Mocks e Simulações

Os testes usam mocks para simular as APIs:

- `/api/verify-address` - Validação de endereços
- `/api/create-shipment` - Criação de envios

Isso permite testar o comportamento da aplicação sem depender de APIs externas.

## Cobertura dos Testes

Os testes cobrem:

### Formulário de Endereço
- ✅ Valores padrão
- ✅ Validação de campos obrigatórios
- ✅ Formato de ZIP code
- ✅ Campos opcionais
- ✅ Estados de loading
- ✅ Seleção de estados

### Formulário de Pacote
- ✅ Valores padrão
- ✅ Validação de valores positivos
- ✅ Limites máximos
- ✅ Valores decimais
- ✅ Estados de loading
- ✅ Dicas e informações

### Fluxo Completo
- ✅ Jornada completa do usuário
- ✅ Tratamento de erros de API
- ✅ Tratamento de erros de rede
- ✅ Navegação entre passos
- ✅ Indicadores de progresso

## Debugging

Se um teste falhar, você pode:

1. Usar `npm run test:debug` para executar em modo debug
2. Usar `npm run test:ui` para interface visual
3. Verificar os traces gerados em `test-results/`
4. Verificar screenshots em `test-results/`

## Adicionando Novos Testes

Para adicionar novos testes:

1. Crie um novo arquivo `.spec.ts` no diretório `tests/`
2. Use a estrutura padrão do Playwright
3. Adicione mocks para APIs quando necessário
4. Execute os testes para verificar se funcionam

Exemplo de estrutura:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Novo Teste', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // ... seus testes aqui
  });
});
```
