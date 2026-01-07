# PLANO_3 - Remover Geração de Novas Fotos (Photo Generation Removal)

## Objetivo Principal

Remover totalmente a funcionalidade de **"Gerar Novas Fotos"** do aplicativo, mantendo apenas o modo **"Aprimorar Fotos Existentes"** (Retouch). Todo o código relacionado à geração será arquivado em uma pasta de legado sem ser deletado.

---

## 1. Análise de Componentes a Remover

### 1.1 Tipos e Interfaces

- `GenerationMode` type em `/app/actions/generate.ts` → Remover, usar apenas string literal 'retouch'
- `CoupleDetails` interface em `/app/actions/generate.ts` → Mover para legado
- Props relacionadas ao modo generate em componentes

### 1.2 Funções Server Actions

- `retouchPhotos()` em `/app/actions/generate.ts` → Mover para `/legacy_photo_generation/`
- Manter apenas `generatePhotos()` que faz o retouch de fotos já existentes

### 1.3 Componentes React

- `ReferenceInstructions` em `/app/[locale]/_components/_formComponents/ReferenceInstructions.tsx` → Mover para legado
- Remover do index.ts de exportações

### 1.4 Hooks e Estado

Em `/app/[locale]/_hooks/useInvitationForm.ts`:

- Estados: `partner1Photos`, `partner2Photos` → Remover
- Handlers: `handlePartner1PhotosChange`, `handlePartner2PhotosChange` → Remover
- Validações e lógica do modo "generate" em `handleGenerate` → Remover
- Propriedades no retorno do hook → Remover

### 1.5 Componentes de Formulário

Em `/app/[locale]/_components/InvitationFormSection.tsx`:

- Props: `partner1Photos`, `partner2Photos`, handlers de parceiros → Remover
- Toggle de modo (retouch/generate) → Remover
- Seção `partner-photos-section` (div com dois uploads) → Remover
- Seção `couple-details-section` (descrição do casal) → Remover
- Lógica condicional que renderiza diferentemente para cada modo → Simplificar para apenas retouch

Em `/app/[locale]/_components/_formComponents/PhotosSection.tsx`:

- Props: `contextualTip`, `maxPhotos` → Remover ou manter apenas para compatibilidade
- Manter apenas com `maxPhotos={3}` e sem dica contextual

### 1.6 Página Principal

Em `/app/[locale]/page.tsx`:

- Remover props de parceiros do `<InvitationFormSection />`
- Remover handlers de parceiros

### 1.7 Tradução (i18n)

Em `/messages/en.json`, `/messages/pt.json`, `/messages/es.json`:

- Remover chaves: `form.photos.partner1Photos`, `form.photos.partner2Photos`
- Remover chaves: `form.photos.partner1Hint`, `form.photos.partner2Hint`
- Remover chaves: `form.photos.contextualTip`
- Remover chaves: `form.photo.generationMode` e suas opções
- Remover chaves: `form.photo.coupleDetails` e todas as subchaves
- Remover chave: `errors.partnerPhotosRequired`
- Manter apenas: `form.photos.retouchHint`

### 1.8 Estilos CSS

Em `/app/styles/_forms.css`:

- Remover `.generation-mode-toggle` e seus variantes
- Remover `.couple-details-section` e variantes
- Remover `.partner-photos-section`, `.partner-upload-area`, `.partner-label`
- Remover `.dos-donts-grid`, `.dos-donts-card`, `.do-card`, `.dont-card` e variantes
- Remover `.upload-contextual-tip` e estilos relacionados
- Remover media queries específicas para layout de parceiros
- Simplificar `.multi-photo-grid` para sempre usar 3 colunas

---

## 2. Estrutura da Pasta de Legado

Criar `/legacy_photo_generation/` com a seguinte estrutura:

```
/legacy_photo_generation/
├── README.md (documentação do que foi movido e como restaurar)
├── /functions/
│   └── retouchPhotos.ts (função original com comentários)
├── /types/
│   └── photoGeneration.ts (GenerationMode, CoupleDetails, etc)
├── /components/
│   ├── ReferenceInstructions.tsx
│   └── CoupleDetailsSection.tsx (se necessário)
└── /translations/
    ├── en.json (chaves removidas do app)
    ├── pt.json
    └── es.json
```

---

## 3. Ordem de Execução

### Fase 1: Preparação

- [ ] Criar pasta `/legacy_photo_generation/` e subpastas
- [ ] Copiar arquivos para legado (não deletar do app ainda)

### Fase 2: Remover do Hook (`useInvitationForm.ts`)

- [ ] Remover estados de partner photos
- [ ] Remover handlers de partner photos
- [ ] Remover GenerationMode type
- [ ] Simplificar `handleGenerate` para apenas modo retouch
- [ ] Atualizar interface `UseInvitationFormReturn` para remover propriedades de partner

### Fase 3: Remover da Interface Principal (`InvitationFormSection.tsx`)

- [ ] Remover props de partner photos
- [ ] Remover toggle de modo
- [ ] Remover seção de ReferenceInstructions
- [ ] Remover seção de partner-photos-section
- [ ] Remover seção de couple-details-section
- [ ] Remover lógica condicional de renderização por modo
- [ ] Manter apenas um `<PhotosSection />` para aprimoramento

### Fase 4: Atualizar PhotosSection

- [ ] Remover props opcionais `contextualTip` e `maxPhotos` se não usados em outros lugares
- [ ] Documentar como era o uso antigo

### Fase 5: Atualizar page.tsx

- [ ] Remover props de partner photos
- [ ] Remover handlers de partner photos

### Fase 6: Limpar Traduções

- [ ] Remover chaves de generation mode
- [ ] Remover chaves de couple details
- [ ] Remover chaves de partner photos
- [ ] Remover chaves de partner hints
- [ ] Remover chave de erro partnerPhotosRequired
- [ ] Simplificar seção de fotos (remover referenceInstructions.doLabel, dontLabel)

### Fase 7: Simplificar CSS

- [ ] Remover estilos de generation-mode-toggle
- [ ] Remover estilos de couple-details-section
- [ ] Remover estilos de partner sections
- [ ] Remover estilos de dos-donts visual pattern
- [ ] Remover estilos de upload-contextual-tip
- [ ] Remover media queries de layout de parceiros
- [ ] Reverter `.multi-photo-grid` para padrão

### Fase 8: Remover Componentes

- [ ] Deletar `/app/[locale]/_components/_formComponents/ReferenceInstructions.tsx`
- [ ] Atualizar `/app/[locale]/_components/_formComponents/index.ts` para remover export

### Fase 9: Remover de generate.ts

- [ ] Remover função `retouchPhotos()`
- [ ] Remover type `GenerationMode` e `CoupleDetails`
- [ ] Remover imports não usados
- [ ] Manter apenas `generatePhotos()` (retouch)

### Fase 10: Testes

- [ ] Verificar se há erros no TypeScript
- [ ] Testar fluxo completo de upload e aprimoramento
- [ ] Validar que não há mais UI para geração de novas fotos
- [ ] Confirmar que traduções não têm mais referências a modo de geração

---

## 4. Arquivos a Arquivar em `/legacy_photo_generation/`

### Código a Mover

1. `retouchPhotos()` completa com comentários
2. Types: `GenerationMode`, `CoupleDetails`
3. `ReferenceInstructions.tsx` completo
4. Estilos antigos (.dos-donts-_, .partner-photos-_, etc)

### Documentação a Incluir

1. README.md com:
   - O que foi removido e por quê
   - Como o código funcionava
   - Como restaurar se necessário
   - Changelog das mudanças

### Traduções a Arquivar

1. Chaves removidas em EN, PT, ES
2. Comentários sobre o que cada chave fazia

---

## 5. Validações Finais

- [ ] Nenhum console.error ou warning relacionado a propriedades faltando
- [ ] App funciona corretamente apenas com modo "retouch"
- [ ] Não há mais referências a "partner photos" na interface
- [ ] Não há mais referências a "couple details" na interface
- [ ] CSS não tem classes órfãs
- [ ] Traduções não têm chaves não utilizadas
- [ ] Hook retorna apenas as propriedades necessárias para retouch
- [ ] Componentes recebem apenas as props que usam

---

## 6. Notas de Reversibilidade

- Toda a funcionalidade original está em `/legacy_photo_generation/`
- Nada foi deletado, apenas movido
- Para restaurar em futuro: copiar de volta dos arquivos legado
- Git history mantém versão anterior se necessário

---

## 7. Benefícios

✅ App mais simples e focado  
✅ UX mais clara (apenas um fluxo)  
✅ Menos código no app ativo  
✅ Menos traduções para manter  
✅ Menos componentes e complexidade  
✅ Código legado preservado para futuro
