# PLANO 6: Centralizar Modal de Comparação de Fotos

## 📋 Problema Identificado

O modal de comparação de fotos não está centralizado corretamente na tela. Ele aparece deslocado para a esquerda, alinhado com a seção do formulário ao invés de estar **exatamente no centro da viewport**.

### Causa Raiz

1. O `<BeforeAfterModal>` está sendo renderizado **dentro** do componente `InvitationFormSection`
2. Isso faz com que o modal herde contextos de posicionamento do pai
3. O `position: fixed` pode ser afetado por `transform`, `filter`, ou `will-change` em elementos ancestrais

---

## 🎯 Objetivo

Centralizar o modal **exatamente no meio da viewport** (centro absoluto da tela), cobrindo tanto a seção de formulário quanto a seção de preview, com:

- Backdrop com blur cobrindo toda a tela
- Modal centralizado horizontal e verticalmente
- Funcionar em todas as resoluções

---

## 🔧 FASE 1: Mover Modal para o Nível da Página ✅ CONCLUÍDA

### Problema

O modal está dentro de `InvitationFormSection.tsx`, que está dentro de um layout flex com outras seções.

### Solução

Mover o modal para `page.tsx` (nível mais alto) usando React Portal ou simplesmente renderizando no componente pai.

**Arquivo**: `/app/[locale]/page.tsx`

### Mudanças Realizadas:

1. ✅ Removido `<BeforeAfterModal>` de `InvitationFormSection.tsx`
2. ✅ Removido import de `BeforeAfterModal` de `InvitationFormSection.tsx`
3. ✅ Removidas props não utilizadas: `isComparisonModalOpen`, `selectedPhotoIndex`, `photoComparisons`, `onCloseComparison`
4. ✅ Adicionado `<BeforeAfterModal>` diretamente em `page.tsx` após o container principal
5. ✅ Adicionado import de `BeforeAfterModal` em `page.tsx`

**Estimativa**: ~20 linhas | 10 min

---

## 🔧 FASE 2: Usar React Portal (Opcional mas Recomendado)

Se mover para `page.tsx` não resolver completamente, usar React Portal para renderizar o modal diretamente no `<body>`.

**Arquivo**: `/app/components/ui/BeforeAfterModal/BeforeAfterModal.tsx`

### Mudanças:

```tsx
import { createPortal } from 'react-dom';

// No retorno do componente:
return createPortal(
  <div className="modal-backdrop" ...>
    {/* conteúdo do modal */}
  </div>,
  document.body
);
```

**Estimativa**: ~15 linhas | 10 min

---

## 🔧 FASE 3: Garantir CSS de Centralização Absoluta

**Arquivo**: `/app/styles/_beforeAfterModal.css`

### CSS Garantido:

```css
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999; /* Mais alto possível */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.comparison-modal {
  /* Não usar margin auto - deixar flexbox centralizar */
  position: relative;
  max-width: 1000px;
  width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
}
```

**Estimativa**: ~20 linhas | 5 min

---

## 🔧 FASE 4: Remover Interferências de CSS

Verificar e remover possíveis interferências:

1. **Verificar se algum ancestral tem `transform`**: Isso quebra `position: fixed`
2. **Verificar `overflow` em containers**: Pode limitar o modal
3. **Garantir z-index alto o suficiente**: Acima de todo o conteúdo

**Estimativa**: 10 min

---

## 📐 Arquitetura Final

### Antes (Problemático):

```
<main>
  <div className="main-content">
    <InvitationFormSection>
      <form>...</form>
      <BeforeAfterModal /> ❌ Modal dentro do form-section
    </InvitationFormSection>
    <PreviewSection />
  </div>
</main>
```

### Depois (Correto):

```
<main>
  <div className="main-content">
    <InvitationFormSection>
      <form>...</form>
      {/* Modal removido daqui */}
    </InvitationFormSection>
    <PreviewSection />
  </div>

  <BeforeAfterModal /> ✅ Modal no nível mais alto
</main>
```

### Ou com Portal:

```
<body>
  <div id="__next">
    <main>...</main>
  </div>

  <BeforeAfterModal /> ✅ Portal renderiza direto no body
</body>
```

---

## 📊 Resumo de Estimativas

| Fase      | Descrição                    | Tempo       |
| --------- | ---------------------------- | ----------- |
| 1         | Mover modal para page.tsx    | 10 min      |
| 2         | Implementar React Portal     | 10 min      |
| 3         | Ajustar CSS de centralização | 5 min       |
| 4         | Remover interferências       | 10 min      |
| **TOTAL** | **4 fases**                  | **~35 min** |

---

## 🎯 Ordem de Execução Recomendada

1. **FASE 1** → Mover modal para page.tsx
2. **FASE 3** → Ajustar CSS
3. **Testar** → Se funcionar, pular Fase 2
4. **FASE 2** → Se ainda não centralizado, implementar Portal
5. **FASE 4** → Verificar e remover interferências

---

## ✅ Critérios de Sucesso

- [ ] Modal aparece exatamente no centro da viewport
- [ ] Backdrop cobre 100% da tela (incluindo formulário E preview)
- [ ] Blur de fundo é uniforme em toda a tela
- [ ] Funciona em desktop, tablet e mobile
- [ ] Botão de fechar (X) sempre acessível
- [ ] ESC fecha o modal
- [ ] Click no backdrop fecha o modal

---

**Status**: ⏳ Aguardando execução
**Prioridade**: 🔴 Alta (UX crítico)
**Complexidade**: 🟢 Baixa
