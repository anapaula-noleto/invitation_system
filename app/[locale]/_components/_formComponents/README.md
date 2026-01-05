# Form Components Architecture

Este diretório contém componentes de formulário reutilizáveis e bem estruturados para a seção de convite.

## Estrutura

```
_formComponents/
├── index.ts                    # Exportações centralizadas
├── FormCheckbox.tsx            # Componente de checkbox com label e descrição
├── VenueField.tsx              # Campo de venue com Maps
├── ReceptionVenueField.tsx     # Campo de recepção com toggle condicional
├── BasicInfoFields.tsx         # Foto, nomes, data, template
└── CustomTextsSection.tsx      # Seção de textos customizados com AI
```

## Componentes

### FormCheckbox

Checkbox reutilizável com label e descrição opcional.

**Props:**

- `id?`: string - ID do checkbox
- `checked`: boolean - Estado do checkbox
- `onChange`: (checked: boolean) => void - Callback de mudança
- `label`: string - Texto do label
- `description?`: string - Descrição opcional abaixo do checkbox
- `className?`: string - Classes CSS adicionais

**Exemplo:**

```tsx
<FormCheckbox
  checked={isChecked}
  onChange={setIsChecked}
  label="A recepção é em um local diferente"
  description="Deixe marcado se houver venue separada"
/>
```

### VenueField

Campo de venue com Google Places Autocomplete e botão de Maps.

**Props:**

- `label`: string - Label do campo
- `value`: string - Valor atual
- `onChange`: (value: string) => void - Callback de mudança
- `placeholder`: string - Placeholder do campo
- `viewOnMapsLabel?`: string - Label do botão de maps
- `onMapClick?`: () => void - Callback do clique em maps

**Exemplo:**

```tsx
<VenueField
  label="Local da Cerimônia"
  value={venue}
  onChange={setVenue}
  placeholder="Digite o local..."
  viewOnMapsLabel="Ver no Mapa"
  onMapClick={() => window.open(...)}
/>
```

### ReceptionVenueField

Combina checkbox + campo de recepção condicional.

**Props:**

- `checkboxLabel`: string - Label do checkbox
- `isChecked`: boolean - Estado do checkbox
- `onCheckChange`: (checked: boolean) => void - Callback do checkbox
- `venueLabel`: string - Label do campo de venue
- `venueValue`: string - Valor do campo
- `onVenueChange`: (value: string) => void - Callback de mudança
- `venuePlaceholder`: string - Placeholder do campo

**Exemplo:**

```tsx
<ReceptionVenueField
  checkboxLabel="Recepção em local diferente?"
  isChecked={hasSeparate}
  onCheckChange={setHasSeparate}
  venueLabel="Local da Recepção"
  venueValue={receptionVenue}
  onVenueChange={setReceptionVenue}
  venuePlaceholder="Digite o local..."
/>
```

### BasicInfoFields

Agrupa foto, nomes dos parceiros, data e seleção de template.

**Props:**

- `photoPreview`: string | null
- `onPhotoChange`: (file: File, preview: string, base64: string) => void
- `onPhotoClear`: () => void
- `photoLabel`: string
- `photoHint`: string
- `partner1`, `partner2`: string
- `onPartner1Change`, `onPartner2Change`: (value: string) => void
- `partner1Label`, `partner2Label`: string
- `partner1Placeholder`, `partner2Placeholder`: string
- `weddingDate`: string
- `onDateChange`: (date: string, formatted: string) => void
- `dateLabel`: string
- `datePlaceholder`: string
- `minDate?`: string
- `months`, `weekdays`, `weekdaysFull`: string[]
- `todayLabel`: string
- `selectedTemplate`: TemplateId
- `onTemplateChange`: (value: TemplateId) => void
- `templateLabel`: string
- `templateOptions`: Array<{ value: TemplateId; label: string }>

### CustomTextsSection

Seção com campos de texto customizados (saudação, história, fechamento) com IA.

**Props:**

- `greeting`, `story`, `closing`: { value, onChange, label, enhanceLabel, enhancingLabel, clearLabel }
- `title`: string - Título da seção
- `subtitle`: string - Subtítulo da seção
- `locale`: string - Localidade para IA

## Benefícios da Componentização

✅ **Reutilização**: Componentes podem ser usados em outros formulários
✅ **Manutenibilidade**: Cada componente tem responsabilidade única
✅ **Testabilidade**: Componentes isolados são fáceis de testar
✅ **Legibilidade**: Código mais limpo e organizado
✅ **Escalabilidade**: Fácil adicionar novos componentes

## Como Usar

```tsx
import {
  FormCheckbox,
  VenueField,
  ReceptionVenueField,
  BasicInfoFields,
  CustomTextsSection,
} from "@/app/[locale]/_components/_formComponents";

// Use os componentes no seu formulário
```

## Estilos

Os estilos são definidos em:

- `globals.css` - Classes base (.form-checkbox\*, .form-group, etc)
- Variáveis CSS customizadas para tema
