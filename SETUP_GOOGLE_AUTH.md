# Configuração do Login com Google

Para que o login funcione, você precisa configurar um projeto no Google Cloud e adicionar as credenciais ao AI Studio.

## 1. Criar Credenciais no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Crie um novo projeto (ou selecione um existente).
3. Vá em **APIs e Serviços** > **Tela de permissão OAuth**.
   - Selecione **Externo** e clique em Criar.
   - Preencha o "Nome do App" (ex: Gestão de Fretes), e os emails de suporte.
   - Salve e continue até o fim.
4. Vá em **Credenciais** > **Criar Credenciais** > **ID do cliente OAuth**.
   - Tipo de aplicativo: **Aplicativo da Web**.
   - Nome: `Gestão de Fretes`.

## 2. Configurar URLs Autorizadas

No formulário de criação do ID do cliente, adicione exatamente estas URLs:

**Origens JavaScript autorizadas:**
- `https://ais-dev-hbevcz7ppv6qibppmapyt7-26868898425.us-east1.run.app`
- `https://ais-pre-hbevcz7ppv6qibppmapyt7-26868898425.us-east1.run.app`

**URIs de redirecionamento autorizados:**
- `https://ais-dev-hbevcz7ppv6qibppmapyt7-26868898425.us-east1.run.app/auth/callback`
- `https://ais-pre-hbevcz7ppv6qibppmapyt7-26868898425.us-east1.run.app/auth/callback`

> **Nota:** Adicione ambas as URLs para garantir que o login funcione tanto no modo de edição quanto quando você compartilhar o app.

Clique em **Criar**.

## 3. Adicionar Segredos no AI Studio

1. Copie o **ID do cliente** e a **Chave secreta do cliente** gerados pelo Google.
2. No AI Studio, procure pelo painel de **Secrets** (ou Variáveis de Ambiente).
3. Adicione duas novas variáveis:

| Nome | Valor |
|------|-------|
| `GOOGLE_CLIENT_ID` | *Cole seu ID do cliente aqui* |
| `GOOGLE_CLIENT_SECRET` | *Cole sua Chave secreta aqui* |

4. Reinicie a aplicação (se necessário) para aplicar as mudanças.
