# Google Maps API Setup Guide

## Para usar o Google Maps Embed API (Mapa interativo)

Se você deseja mostrar o mapa interativo do Google Maps na sua página de convite, siga estes passos:

### 1. Criar um Google Cloud Project

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto (nome sugerido: "Wedding Invitations")

### 2. Habilitar as APIs necessárias

1. No menu lateral, vá para **APIs & Services** > **Library**
2. Procure por **"Maps Embed API"** e clique para abrir
3. Clique em **Enable**
4. Procure por **"Maps JavaScript API"** e clique para abrir
5. Clique em **Enable**

### 3. Criar uma API Key

1. Vá para **APIs & Services** > **Credentials**
2. Clique em **+ Create Credentials** > **API Key**
3. Uma nova API key será gerada e mostrada em um modal
4. Copie a chave

### 4. Configurar as restrições da API Key

⚠️ **Importante para segurança:**

1. Na página de Credentials, clique na sua API Key
2. Em **Application restrictions**, selecione **HTTP referrers (web sites)**
3. Adicione seus domínios (ex: `yourdomain.com`, `www.yourdomain.com`)
4. Em **API restrictions**, selecione **Restrict key** e escolha:
   - Maps Embed API
   - Maps JavaScript API
   - Places API
5. Clique em **Save**

### 5. Adicionar a chave ao seu projeto

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Nota:** Se o arquivo `.env.local` já existe, apenas adicione a variável ao final.

### 6. Reiniciar o servidor

```bash
npm run dev
```

Pronto! O mapa agora deve aparecer nas páginas de convite.

---

## Se a API Key não estiver configurada

Se você não configurar a API Key, o aplicativo exibirá um fallback elegante com:

- Ícone de localização animado (📍)
- Nome do local
- Link direto para o Google Maps

Este fallback não requer qualquer configuração e funciona automaticamente!

---

## Solução de problemas

### "Google Maps Platform rejected your request"

Isso significa que a API não está habilitada ou a chave está incorreta.

**Verificar:**

1. A API Key está correta em `.env.local`?
2. As APIs foram habilitadas no Google Cloud Console?
3. As restrições de API foram configuradas corretamente?
4. Seu domínio está na whitelist das restrições HTTP referrers?

### O mapa não aparece

1. Limpe o cache: `rm -rf .next`
2. Reinicie o servidor: `npm run dev`
3. Verifique o console do navegador (F12) para erros

### Teste sem API Key

Se prefere não usar o Google Maps Embed API agora, o fallback será mostrado automaticamente!

---

## Custos

- **Maps Embed API**: Algumas requisições são gratuitas, mas há limites
- **Maps JavaScript API**: Gratuito até um certo número de requisições
- **Places API**: Tem um custo associado

Para mais informações sobre preços, veja: https://cloud.google.com/maps-platform/pricing
