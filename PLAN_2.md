# Plano de Implementação: Novo Fluxo de Upload de Fotos por Modo

## 📋 Objetivo

Modificar o fluxo de upload de fotos baseado no modo selecionado:

1. **Modo "Aprimorar Fotos"**: Usuário envia exatamente 3 fotos do casal junto para serem aprimoradas
2. **Modo "Gerar Novas Fotos"**: Usuário envia 2 fotos de referência de cada parceiro (sozinho) para a IA criar novas imagens do casal junto

---

## 🎯 Fluxo do Usuário

### Modo "Aprimorar Fotos" (Retouch)

1. Usuário seleciona modo "Aprimorar Fotos"
2. Sistema exibe área de upload para 3 fotos do casal
3. Instrução: "Envie até 3 fotos do casal junto para aprimoramento profissional"
4. Usuário faz upload das fotos
5. IA retoca as fotos mantendo o conteúdo original

### Modo "Gerar Novas Fotos" (Generate)

1. Usuário seleciona modo "Gerar Novas Fotos"
2. Sistema exibe:
   - **Seção Parceiro 1**: Upload de 2 fotos individuais
   - **Seção Parceiro 2**: Upload de 2 fotos individuais
3. Instruções detalhadas sobre qualidade das fotos de referência
4. Campos de descrição de cada parceiro
5. Seleção de estilo de roupa e cenário
6. IA gera novas imagens do casal junto baseado nas referências

---

## 📸 Requisitos de Fotos por Modo

### Modo Retouch

| Aspecto    | Requisito                          |
| ---------- | ---------------------------------- |
| Quantidade | Até 3 fotos                        |
| Tipo       | Fotos do casal junto               |
| Propósito  | Aprimoramento/retoque profissional |

### Modo Generate

| Aspecto    | Requisito                            |
| ---------- | ------------------------------------ |
| Parceiro 1 | 2 fotos individuais                  |
| Parceiro 2 | 2 fotos individuais                  |
| Total      | 4 fotos (2 + 2)                      |
| Tipo       | Fotos individuais (pessoa SOZINHA)   |
| Propósito  | Referência facial para geração de IA |

---

## 📝 Instruções para o Usuário (Modo Generate)

### Requisitos das Fotos de Referência

```
Para melhores resultados, as fotos de referência devem:

✓ Mostrar a pessoa SOZINHA (sem outras pessoas)
✓ Ter boa iluminação (luz natural é ideal)
✓ Mostrar o rosto claramente visível
✓ Não ter óculos escuros ou acessórios que cubram o rosto
✓ Ter fundo simples, se possível
✓ Ser fotos recentes
✓ Mostrar diferentes ângulos do rosto (frontal + perfil ideal)

Evite:
✗ Fotos em grupo
✗ Fotos com baixa iluminação
✗ Fotos com óculos escuros
✗ Fotos muito distantes
✗ Fotos com filtros pesados
✗ Fotos borradas ou de baixa qualidade
```

---

## 🗂️ Arquivos a Modificar/Criar

### 1. Interface CoupleDetails (`generate.ts`)

**Adicionar campos para fotos separadas:**

```typescript
interface CoupleDetails {
  partner1Description: string;
  partner2Description: string;
  outfitStyle: string;
  setting: string;
}

// Novo: Interface para fotos de referência separadas
interface ReferencePhotos {
  partner1Photos: string[]; // 2 fotos base64
  partner2Photos: string[]; // 2 fotos base64
}
```

**Atualizar função `retouchPhotos`:**

- Receber fotos separadas por parceiro
- Atualizar prompt para indicar quais fotos são de qual parceiro

---

### 2. Hook de Estado (`useInvitationForm.ts`)

**Novos estados:**

```typescript
// Para modo generate - fotos separadas por parceiro
const [partner1Photos, setPartner1Photos] = useState<PhotoItem[]>([]);
const [partner2Photos, setPartner2Photos] = useState<PhotoItem[]>([]);
```

**Atualizar lógica de geração:**

```typescript
if (generationMode === "retouch") {
  // Usa photos[] (fotos do casal junto)
  result = await generatePhotos(photosBase64, photoStyle);
} else {
  // Usa partner1Photos[] e partner2Photos[] separadamente
  const partner1Base64 = partner1Photos.map((p) => p.base64);
  const partner2Base64 = partner2Photos.map((p) => p.base64);
  result = await retouchPhotos(
    { partner1Photos: partner1Base64, partner2Photos: partner2Base64 },
    photoStyle,
    coupleDetails,
    3,
  );
}
```

**Novos handlers:**

```typescript
handlePartner1PhotosChange: (photos: PhotoItem[]) => void;
handlePartner2PhotosChange: (photos: PhotoItem[]) => void;
```

---

### 3. Componente PhotosSection (`PhotosSection.tsx`)

**Criar duas variantes ou props condicionais:**

```typescript
interface PhotosSectionProps {
  mode: "retouch" | "generate";
  // Modo retouch
  photos?: PhotoItem[];
  onPhotosChange?: (photos: PhotoItem[]) => void;
  // Modo generate
  partner1Photos?: PhotoItem[];
  partner2Photos?: PhotoItem[];
  onPartner1PhotosChange?: (photos: PhotoItem[]) => void;
  onPartner2PhotosChange?: (photos: PhotoItem[]) => void;
}
```

**OU criar componente separado:**

- `PhotosSectionRetouch` - para modo aprimorar
- `PhotosSectionGenerate` - para modo gerar (com seções separadas)

---

### 4. Componente InvitationFormSection (`InvitationFormSection.tsx`)

**Renderização condicional baseada no modo:**

```tsx
{
  generationMode === "retouch" ? (
    <PhotosSectionRetouch
      photos={photos}
      onPhotosChange={onPhotosChange}
      hint={t("form.photo.retouchHint")}
      addPhotoLabel={t("form.photo.addPhoto")}
    />
  ) : (
    <PhotosSectionGenerate
      partner1Photos={partner1Photos}
      partner2Photos={partner2Photos}
      onPartner1PhotosChange={onPartner1PhotosChange}
      onPartner2PhotosChange={onPartner2PhotosChange}
      partner1Label={t("form.photo.partner1Photos.label")}
      partner2Label={t("form.photo.partner2Photos.label")}
      instructions={t("form.photo.referenceInstructions")}
    />
  );
}
```

---

### 5. Novo Componente: PhotosSectionGenerate

**Estrutura:**

```tsx
<div className="generate-photos-section">
  {/* Instruções importantes */}
  <div className="reference-instructions">
    <AlertTriangle />
    <h4>Instruções para fotos de referência</h4>
    <ul>
      <li>Fotos de cada pessoa SOZINHA</li>
      <li>Boa iluminação</li>
      <li>Sem óculos escuros</li>
      <li>Rosto claramente visível</li>
      ...
    </ul>
  </div>

  {/* Upload Parceiro 1 */}
  <div className="partner-photos-section">
    <h4>Fotos do Parceiro 1</h4>
    <p>Envie 2 fotos individuais</p>
    <MultiPhotoUpload
      value={partner1Photos}
      onChange={onPartner1PhotosChange}
      maxPhotos={2}
    />
  </div>

  {/* Upload Parceiro 2 */}
  <div className="partner-photos-section">
    <h4>Fotos do Parceiro 2</h4>
    <p>Envie 2 fotos individuais</p>
    <MultiPhotoUpload
      value={partner2Photos}
      onChange={onPartner2PhotosChange}
      maxPhotos={2}
    />
  </div>
</div>
```

---

### 6. Atualizar Prompt de Geração (`generate.ts`)

**Novo prompt para modo generate:**

```typescript
const prompt = `You are a world-class professional wedding photographer creating stunning pre-wedding photoshoot images.

REFERENCE PHOTOS PROVIDED:
- The FIRST ${partner1Photos.length} images are reference photos of PARTNER 1
- The NEXT ${partner2Photos.length} images are reference photos of PARTNER 2

IMPORTANT INSTRUCTIONS:
1. Study each partner's face CAREFULLY from their individual reference photos
2. Partner 1 appears in images 1-2 (individual photos)
3. Partner 2 appears in images 3-4 (individual photos)
4. Generate a NEW image showing BOTH partners TOGETHER as a couple

COUPLE DESCRIPTION:
- Partner 1: ${coupleDetails.partner1Description}
- Partner 2: ${coupleDetails.partner2Description}
- Outfit Style: ${coupleDetails.outfitStyle}
- Setting/Location: ${coupleDetails.setting}

PHOTO STYLE:
${styleInstructions}

GENERATION GUIDELINES:
- Create a professional pre-wedding photograph with BOTH partners together
- Each person's face must match their reference photos EXACTLY
- Position them naturally as a couple (holding hands, embracing, etc.)
- Place them in the specified setting: ${coupleDetails.setting}
- Dress them in ${coupleDetails.outfitStyle} attire
- Apply professional lighting and composition
- Create a romantic, magazine-quality image

OUTPUT: A beautiful pre-wedding photograph featuring both partners together.`;
```

---

### 7. Traduções (`messages/*.json`)

**Novas chaves:**

```json
{
  "form": {
    "photo": {
      "retouchHint": "Upload up to 3 photos of the couple together for professional enhancement",
      "generateHint": "Upload reference photos of each partner individually",
      "partner1Photos": {
        "label": "Partner 1 Reference Photos",
        "hint": "Upload 2 individual photos"
      },
      "partner2Photos": {
        "label": "Partner 2 Reference Photos",
        "hint": "Upload 2 individual photos"
      },
      "referenceInstructions": {
        "title": "Photo Requirements for Best Results",
        "items": {
          "alone": "Each person should be ALONE in their photos",
          "lighting": "Good lighting (natural light is best)",
          "face": "Face clearly visible, no obstructions",
          "noSunglasses": "No sunglasses or accessories covering face",
          "background": "Simple background if possible",
          "recent": "Recent photos",
          "angles": "Different angles help (front + side view ideal)"
        },
        "avoid": {
          "title": "Avoid",
          "group": "Group photos",
          "dark": "Low light photos",
          "sunglasses": "Sunglasses",
          "distant": "Distant/small face",
          "filters": "Heavy filters",
          "blurry": "Blurry or low quality"
        }
      }
    }
  }
}
```

---

### 8. Estilos CSS

**Novos estilos:**

```css
/* Seção de instruções de referência */
.reference-instructions {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.reference-instructions-title {
}
.reference-instructions-list {
}
.reference-instructions-avoid {
}

/* Seções de upload por parceiro */
.partner-photos-section {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.partner-photos-header {
}
.partner-photos-label {
}
.partner-photos-hint {
}
```

---

## 📐 Estrutura de Componentes Atualizada

```
InvitationFormSection
└── TabPanel id="photos"
    ├── GenerationModeToggle
    │
    ├── [Se modo = 'retouch']
    │   └── PhotosSectionRetouch
    │       └── MultiPhotoUpload (maxPhotos=3)
    │
    └── [Se modo = 'generate']
        └── PhotosSectionGenerate
            ├── ReferenceInstructions (instruções detalhadas)
            ├── Partner1PhotosUpload
            │   ├── Label + Hint
            │   └── MultiPhotoUpload (maxPhotos=2)
            ├── Partner2PhotosUpload
            │   ├── Label + Hint
            │   └── MultiPhotoUpload (maxPhotos=2)
            └── CoupleDetailsSection
                ├── Partner1Description
                ├── Partner2Description
                ├── OutfitStyle
                └── Setting
```

---

## 🔄 Fluxo de Dados Atualizado

### Modo Retouch

```
photos[] (3 fotos do casal)
    ↓
generatePhotos(photosBase64, style)
    ↓
Prompt com 3 imagens do casal
    ↓
IA retoca cada foto
```

### Modo Generate

```
partner1Photos[] (2 fotos individuais)
partner2Photos[] (2 fotos individuais)
    ↓
retouchPhotos({ partner1: [...], partner2: [...] }, style, details)
    ↓
Prompt com 4 imagens (2 + 2, claramente identificadas)
    ↓
IA gera nova imagem do casal junto
```

---

## ⚠️ Validações

### Modo Retouch

- Pelo menos 1 foto deve ser enviada
- Máximo 3 fotos

### Modo Generate

- Pelo menos 1 foto de cada parceiro
- Máximo 2 fotos por parceiro
- Descrições de parceiros preenchidas
- Mensagem de erro clara se requisitos não atendidos

---

## 📝 Ordem de Implementação

1. **Fase 1: Estados e Interface**

   - [ ] Adicionar estados `partner1Photos` e `partner2Photos` no hook
   - [ ] Criar handlers para fotos separadas
   - [ ] Atualizar interface `UseInvitationFormReturn`

2. **Fase 2: Componente de Upload Generate**

   - [ ] Criar componente `ReferenceInstructions`
   - [ ] Criar componente `PhotosSectionGenerate`
   - [ ] Integrar com `InvitationFormSection`

3. **Fase 3: Atualizar Backend (generate.ts)**

   - [ ] Modificar interface para receber fotos separadas
   - [ ] Atualizar função `retouchPhotos`
   - [ ] Criar novo prompt que identifica cada parceiro

4. **Fase 4: Lógica de Geração**

   - [ ] Atualizar `handleGenerate` no hook
   - [ ] Passar fotos corretas baseado no modo

5. **Fase 5: Validações**

   - [ ] Validar quantidade de fotos por modo
   - [ ] Mensagens de erro apropriadas
   - [ ] Desabilitar botão se requisitos não atendidos

6. **Fase 6: Traduções**

   - [ ] en.json
   - [ ] pt.json
   - [ ] es.json

7. **Fase 7: Estilos**
   - [ ] Estilizar instruções de referência
   - [ ] Estilizar seções de upload por parceiro
   - [ ] Responsividade

---

## ✅ Critérios de Aceitação

1. Modo "Retouch" aceita até 3 fotos do casal junto
2. Modo "Generate" aceita 2 fotos de cada parceiro separadamente
3. Instruções claras são exibidas no modo Generate
4. Fotos são enviadas corretamente identificadas para a IA
5. Prompt de geração identifica claramente qual parceiro está em qual foto
6. Validações impedem submissão sem fotos necessárias
7. UI adapta-se ao modo selecionado
8. Todas as strings traduzidas em 3 idiomas
9. IA consegue gerar imagens do casal junto baseado em fotos individuais

---

## 🎨 Mockup da UI - Modo Generate

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Photo Requirements for Best Results              │
│ ─────────────────────────────────────────────────── │
│ ✓ Each person should be ALONE in their photos       │
│ ✓ Good lighting (natural light is best)             │
│ ✓ Face clearly visible, no obstructions             │
│ ✓ No sunglasses or accessories covering face        │
│                                                     │
│ ✗ Avoid: Group photos, low light, heavy filters     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 👤 Partner 1 Reference Photos                       │
│     Upload 2 individual photos                      │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐              │
│ │  📷    │  │  📷    │  │   ➕   │              │
│ │ Photo 1 │  │ Photo 2 │  │  Add   │              │
│ └─────────┘  └─────────┘  └─────────┘              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 👤 Partner 2 Reference Photos                       │
│     Upload 2 individual photos                      │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐              │
│ │  📷    │  │  📷    │  │   ➕   │              │
│ │ Photo 1 │  │ Photo 2 │  │  Add   │              │
│ └─────────┘  └─────────┘  └─────────┘              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Describe the Couple                                 │
│ ─────────────────────────────────────────────────── │
│ Partner 1 Description: [___________________]        │
│ Partner 2 Description: [___________________]        │
│ Outfit Style: [Formal ▼]  Setting: [Garden ▼]      │
└─────────────────────────────────────────────────────┘
```
