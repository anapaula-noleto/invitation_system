# Plano de Implementação: Seleção Manual de Fotos para o Convite

## 📋 Objetivo

Permitir que o usuário salve todas as fotos geradas pela IA em uma "galeria de fotos salvas" e depois escolha manualmente quais fotos (até 3) deseja usar no convite final.

---

## 🎯 Fluxo do Usuário

1. Usuário escolhe modo (retocar ou gerar novas)
2. Usuário faz upload de foto(s) de referência
3. Usuário escolhe estilo para as fotos geradas
4. Usuário clica em "Gerar Imagens"
5. Sistema exibe as imagens geradas na aba "Generated"
6. **NOVO:** Para cada imagem, usuário pode:
   - "Salvar na Galeria" → adiciona à galeria de fotos salvas
   - "Download" → baixa a imagem individual
7. Usuário pode gerar mais imagens (com estilos/configurações diferentes)
8. **NOVO:** Na galeria, usuário vê todas as fotos salvas
9. **NOVO:** Usuário seleciona até 3 fotos da galeria para usar no convite
10. As fotos selecionadas aparecem no template do convite

---

## 🗂️ Arquivos a Modificar/Criar

### 1. Hook de Estado (`useInvitationForm.ts`)

**Novos estados:**

```typescript
// Galeria de fotos salvas pelo usuário
const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

// Fotos selecionadas para o convite (máx 3)
const [selectedPhotosForInvitation, setSelectedPhotosForInvitation] = useState<
  string[]
>([]);
```

**Novos handlers:**

```typescript
// Salvar uma foto na galeria
handleSavePhoto: (imageUrl: string) => void;

// Remover foto da galeria
handleRemoveSavedPhoto: (index: number) => void;

// Selecionar/deselecionar foto para o convite
handleTogglePhotoSelection: (imageUrl: string) => void;

// Limpar seleção
handleClearSelection: () => void;
```

**Atualizar interface:**

- Adicionar novos estados e handlers à interface `UseInvitationFormReturn`

**Atualizar `invitationConfig`:**

- Usar `selectedPhotosForInvitation` em vez de `enhancedPhotosForInvitation`

---

### 2. Componente PreviewSection (`PreviewSection.tsx`)

**Novos props:**

```typescript
interface PreviewSectionProps {
  // ... props existentes ...
  savedPhotos: string[];
  selectedPhotosForInvitation: string[];
  onSavePhoto: (imageUrl: string) => void;
  onRemoveSavedPhoto: (index: number) => void;
  onTogglePhotoSelection: (imageUrl: string) => void;
  onClearSelection: () => void;
}
```

**Novas abas (ou seções):**

1. **Tab "Generated"** - Imagens recém-geradas
   - Cada imagem tem botões: "Salvar na Galeria" e "Download"
2. **Tab "Gallery" (NOVA)** - Galeria de fotos salvas
   - Grid de todas as fotos salvas
   - Cada foto tem checkbox para seleção (máx 3)
   - Indicador visual de quais estão selecionadas
   - Botão "Remover" para cada foto
   - Contador: "2 de 3 fotos selecionadas"
   - Botão "Usar no Convite" (aplicar seleção)

---

### 3. Página Principal (`page.tsx`)

- Passar os novos props para `PreviewSection`

---

### 4. Traduções (`messages/*.json`)

**Novas chaves para en.json:**

```json
{
  "preview": {
    "tabs": {
      "gallery": "Photo Gallery"
    },
    "gallery": {
      "empty": "No photos saved yet. Generate photos and save your favorites.",
      "counter": "{count} of 3 photos selected",
      "maxReached": "Maximum 3 photos can be selected",
      "saveToGallery": "Save to Gallery",
      "saved": "Saved!",
      "remove": "Remove",
      "select": "Select",
      "selected": "Selected",
      "useSelected": "Use Selected Photos",
      "clearSelection": "Clear Selection"
    }
  }
}
```

**Traduzir para pt.json e es.json**

---

### 5. Estilos CSS (`_preview.css` ou `_forms.css`)

**Novos estilos:**

```css
/* Galeria de fotos salvas */
.saved-photos-gallery {
}
.gallery-photo-card {
}
.gallery-photo-card.selected {
}
.gallery-photo-checkbox {
}
.gallery-photo-actions {
}
.selection-counter {
}
.max-selection-warning {
}
```

---

## 📐 Estrutura de Componentes

```
PreviewSection
├── Tabs
│   ├── Tab: Template Preview
│   ├── Tab: Generated (imagens recém-geradas)
│   │   ├── GeneratedImageCard (para cada imagem)
│   │   │   ├── Imagem
│   │   │   ├── Botão "Salvar na Galeria"
│   │   │   └── Botão "Download"
│   │   └── Ações em lote (Download All)
│   └── Tab: Gallery (NOVA)
│       ├── SelectionCounter
│       ├── GalleryGrid
│       │   └── GalleryPhotoCard (para cada foto salva)
│       │       ├── Checkbox de seleção
│       │       ├── Imagem
│       │       └── Botão "Remover"
│       └── GalleryActions
│           ├── Botão "Usar Selecionadas"
│           └── Botão "Limpar Seleção"
```

---

## 🔄 Fluxo de Dados

```
1. Gerar Imagens
   ↓
2. generatedImages[] (estado temporário)
   ↓
3. Usuário clica "Salvar" em imagens desejadas
   ↓
4. savedPhotos[] (galeria persistente na sessão)
   ↓
5. Usuário seleciona fotos na galeria (checkbox)
   ↓
6. selectedPhotosForInvitation[] (máx 3)
   ↓
7. Usuário clica "Usar no Convite"
   ↓
8. invitationConfig.content.photoUrls usa selectedPhotosForInvitation
```

---

## ⚠️ Considerações

### Limite de Seleção

- Máximo de 3 fotos podem ser selecionadas
- UI deve desabilitar checkbox quando limite atingido
- Mostrar mensagem informativa

### Persistência

- Fotos salvas persistem apenas na sessão (estado React)
- Considerar localStorage para persistência entre reloads (opcional/futuro)

### UX

- Feedback visual claro ao salvar foto
- Animação ao adicionar/remover da galeria
- Indicador claro de quais fotos estão no convite

### Performance

- Imagens são base64, podem ser grandes
- Limitar número máximo de fotos na galeria (ex: 20)

---

## 📝 Ordem de Implementação

1. **Fase 1: Estado e Lógica**

   - [ ] Adicionar estados no hook (`savedPhotos`, `selectedPhotosForInvitation`)
   - [ ] Criar handlers (`handleSavePhoto`, `handleTogglePhotoSelection`, etc.)
   - [ ] Atualizar `invitationConfig` para usar fotos selecionadas

2. **Fase 2: UI - Generated Tab**

   - [ ] Adicionar botão "Salvar na Galeria" em cada imagem gerada
   - [ ] Feedback visual ao salvar

3. **Fase 3: UI - Gallery Tab**

   - [ ] Criar nova aba "Gallery"
   - [ ] Implementar grid de fotos salvas
   - [ ] Implementar seleção com checkbox
   - [ ] Implementar contador de seleção
   - [ ] Botões de ação (Usar, Limpar)

4. **Fase 4: Traduções**

   - [ ] Adicionar chaves em en.json
   - [ ] Traduzir para pt.json
   - [ ] Traduzir para es.json

5. **Fase 5: Estilos**

   - [ ] Estilizar galeria
   - [ ] Estilizar cards com seleção
   - [ ] Animações e transições

6. **Fase 6: Testes**
   - [ ] Testar fluxo completo
   - [ ] Testar limites (máx 3 seleções)
   - [ ] Testar responsividade

---

## 🎨 Mockup da UI

### Tab "Generated" (atualizada)

```
┌─────────────────────────────────────┐
│  [Foto 1]    [Foto 2]    [Foto 3]   │
│  [💾 Save]   [💾 Save]   [💾 Save]  │
│  [⬇ Down]   [⬇ Down]   [⬇ Down]   │
└─────────────────────────────────────┘
│ [⬇ Download All]                    │
└─────────────────────────────────────┘
```

### Tab "Gallery" (nova)

```
┌─────────────────────────────────────┐
│ 📷 Photo Gallery    2 of 3 selected │
├─────────────────────────────────────┤
│ ┌─────┐  ┌─────┐  ┌─────┐           │
│ │☑ ✓ │  │☑ ✓ │  │☐   │           │
│ │     │  │     │  │     │           │
│ │ [🗑]│  │ [🗑]│  │ [🗑]│           │
│ └─────┘  └─────┘  └─────┘           │
├─────────────────────────────────────┤
│ [✓ Use Selected]  [✕ Clear]         │
└─────────────────────────────────────┘
```

---

## ✅ Critérios de Aceitação

1. Usuário pode salvar qualquer imagem gerada na galeria
2. Galeria exibe todas as fotos salvas na sessão
3. Usuário pode selecionar até 3 fotos da galeria
4. Fotos selecionadas aparecem no preview do convite
5. Usuário pode remover fotos da galeria
6. Usuário pode limpar seleção
7. UI mostra feedback claro de quantas fotos estão selecionadas
8. Todas as strings estão traduzidas em 3 idiomas
