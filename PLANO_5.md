# PLANO 5: Modal de Comparação Antes/Depois com Slider

## 📋 Objetivo

Criar um modal interativo que permita comparar as fotos originais com as melhoradas usando um slider vertical que revela antes/depois ao ser movido.

---

## 🎯 Funcionalidades

### Modal de Comparação

- **Trigger**: Click em qualquer foto melhorada na seção "✨ Suas Fotos Melhoradas"
- **Conteúdo**:
  - Foto original (antes) à esquerda/baixo
  - Foto melhorada (depois) à direita/cima
  - Slider vertical interativo para revelar antes/depois
  - Informações sobre as melhorias aplicadas
  - Navegação entre múltiplas fotos (se houver mais de uma)
  - Botões de ação (Download, Fechar)

### Slider Antes/Depois

- **Controle**: Barra vertical central que pode ser arrastada
- **Efeito**: Revela progressivamente a foto "depois" conforme o slider move
- **Visual**:
  - Handle circular com ícone de setas (↔)
  - Linha divisória visível
  - Transição suave ao arrastar
- **Interatividade**:
  - Arrastar com mouse (desktop)
  - Arrastar com toque (mobile)
  - Posição inicial: 50% (meio da imagem)

---

## 📐 Estrutura de Componentes

```
BeforeAfterModal/
├── BeforeAfterModal.tsx         # Modal principal
├── BeforeAfterSlider.tsx        # Componente do slider comparativo
└── _beforeAfterModal.css        # Estilos do modal e slider
```

---

## 🔧 FASE 1: Criar Componente BeforeAfterSlider

**Arquivo**: `/app/components/ui/BeforeAfterSlider/BeforeAfterSlider.tsx`

### Estrutura

```tsx
interface BeforeAfterSliderProps {
  beforeImage: string; // URL da foto original
  afterImage: string; // URL da foto melhorada
  beforeLabel?: string; // Label "Original"
  afterLabel?: string; // Label "Melhorada"
}
```

### Funcionalidades

- Estado para posição do slider (0-100%)
- Event listeners para mouse (mousedown, mousemove, mouseup)
- Event listeners para touch (touchstart, touchmove, touchend)
- Atualização dinâmica da máscara de revelação
- Acessibilidade (keyboard navigation)

### HTML Structure

```tsx
<div className="before-after-slider">
  <div className="before-after-container">
    {/* Imagem "Antes" (fundo) */}
    <img src={beforeImage} alt="Before" className="before-image" />

    {/* Imagem "Depois" (com clip-path dinâmico) */}
    <div
      className="after-image-container"
      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
    >
      <img src={afterImage} alt="After" className="after-image" />
    </div>

    {/* Slider Handle */}
    <div className="slider-handle" style={{ left: `${sliderPosition}%` }}>
      <div className="slider-line" />
      <div className="slider-button">
        <ArrowLeftRight size={20} />
      </div>
      <div className="slider-line" />
    </div>

    {/* Labels */}
    <div className="slider-label slider-label-before">{beforeLabel}</div>
    <div className="slider-label slider-label-after">{afterLabel}</div>
  </div>
</div>
```

---

## 🔧 FASE 2: Criar Componente BeforeAfterModal

**Arquivo**: `/app/components/ui/BeforeAfterModal/BeforeAfterModal.tsx`

### Estrutura

```tsx
interface PhotoComparison {
  originalUrl: string; // Foto original
  enhancedUrl: string; // Foto melhorada
  index: number; // Índice da foto
}

interface BeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoComparison[];
  initialIndex: number;
}
```

### Funcionalidades

- Navegação entre fotos (prev/next)
- Exibição de metadados (número da foto, melhorias aplicadas)
- Integração com BeforeAfterSlider
- Botão de download da foto melhorada
- Animações de entrada/saída
- Fechar com ESC ou click no backdrop
- Prevenção de scroll do body quando aberto

### Layout

```
┌─────────────────────────────────────────────┐
│  [X Fechar]                    [← 1/3 →]   │
├─────────────────────────────────────────────┤
│                                             │
│         [BeforeAfterSlider Component]       │
│                                             │
├─────────────────────────────────────────────┤
│  📊 Melhorias Aplicadas:                    │
│  • Correção de iluminação e balanço de cor │
│  • Suavização de pele e redução de ruído   │
│  • Aprimoramento de detalhes e nitidez     │
│                                             │
│  [⬇ Download Foto] [← Anterior] [Próxima →]│
└─────────────────────────────────────────────┘
```

---

## 🔧 FASE 3: Adicionar Estado ao Hook useInvitationForm

**Arquivo**: `/app/[locale]/_hooks/useInvitationForm.ts`

### Adições ao Estado

```typescript
// Estado do modal de comparação
const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

// Armazenar fotos originais para comparação
const [originalPhotosForComparison, setOriginalPhotosForComparison] = useState<
  string[]
>([]);
```

### Adições à Interface

```typescript
export interface UseInvitationFormReturn {
  // ... existing properties

  // Comparison modal state
  isComparisonModalOpen: boolean;
  selectedPhotoIndex: number;
  originalPhotosForComparison: string[];
  photoComparisons: PhotoComparison[];

  // Comparison modal handlers
  handleOpenComparison: (index: number) => void;
  handleCloseComparison: () => void;
}
```

### Handler para Abrir Modal

```typescript
const handleOpenComparison = useCallback((index: number) => {
  setSelectedPhotoIndex(index);
  setIsComparisonModalOpen(true);
}, []);

const handleCloseComparison = useCallback(() => {
  setIsComparisonModalOpen(false);
}, []);
```

### Atualizar handleGenerate

Salvar fotos originais quando gerar:

```typescript
// Após sucesso na geração
if (result.success && result.imageUrls && result.imageUrls.length > 0) {
  setGeneratedImages(result.imageUrls);
  // Salvar fotos originais para comparação
  setOriginalPhotosForComparison(
    photosBase64.map((base64) => `data:image/jpeg;base64,${base64}`),
  );
}
```

### Computar Array de Comparações

```typescript
const photoComparisons = useMemo<PhotoComparison[]>(() => {
  return generatedImages.map((enhancedUrl, index) => ({
    originalUrl: originalPhotosForComparison[index] || "",
    enhancedUrl,
    index,
  }));
}, [generatedImages, originalPhotosForComparison]);
```

---

## 🔧 FASE 4: Integrar Modal no InvitationFormSection

**Arquivo**: `/app/[locale]/_components/InvitationFormSection.tsx`

### Adicionar Props

```typescript
interface InvitationFormSectionProps {
  // ... existing props

  // Comparison modal
  isComparisonModalOpen: boolean;
  selectedPhotoIndex: number;
  photoComparisons: PhotoComparison[];
  onOpenComparison: (index: number) => void;
  onCloseComparison: () => void;
}
```

### Tornar Imagens Clicáveis

```tsx
<div className="generated-images-grid">
  {generatedImages.map((imageUrl, index) => (
    <div
      key={index}
      className="generated-image-wrapper"
      onClick={() => onOpenComparison(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpenComparison(index)}
    >
      <img
        src={imageUrl}
        alt={`Enhanced wedding photo ${index + 1}`}
        className="generated-image"
      />
      <div className="image-overlay">
        <Eye size={24} />
        <span>Ver Comparação</span>
      </div>
    </div>
  ))}
</div>;

{
  /* Modal de Comparação */
}
<BeforeAfterModal
  isOpen={isComparisonModalOpen}
  onClose={onCloseComparison}
  photos={photoComparisons}
  initialIndex={selectedPhotoIndex}
/>;
```

---

## 🔧 FASE 5: Atualizar page.tsx

**Arquivo**: `/app/[locale]/page.tsx`

### Passar Novas Props

```tsx
<InvitationFormSection
  // ... existing props
  isComparisonModalOpen={form.isComparisonModalOpen}
  selectedPhotoIndex={form.selectedPhotoIndex}
  photoComparisons={form.photoComparisons}
  onOpenComparison={form.handleOpenComparison}
  onCloseComparison={form.handleCloseComparison}
/>
```

---

## 🎨 FASE 6: Estilos CSS

**Arquivo**: `/app/styles/_beforeAfterModal.css`

### Estilos do Modal

- Backdrop com blur
- Container centralizado e responsivo
- Animações de entrada/saída (fade + scale)
- Header com título e navegação
- Footer com botões de ação
- Z-index apropriado

### Estilos do Slider

- Container com aspect-ratio preservado
- Posicionamento absoluto das imagens
- Clip-path dinâmico para revelar "depois"
- Slider handle com design atraente
- Linha divisória vertical
- Labels "Antes" e "Depois" posicionados
- Cursor apropriado (col-resize)
- Transições suaves

### Estilos das Imagens Clicáveis

```css
.generated-image-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.generated-image-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(201, 169, 97, 0.3);
}

.generated-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

### Responsividade

- Desktop: Modal ocupa 90vw max-width 1200px
- Tablet: Modal ocupa 95vw
- Mobile: Modal fullscreen com padding reduzido

---

## 🌐 FASE 7: Traduções

**Arquivos**: `/messages/en.json`, `/messages/pt.json`, `/messages/es.json`

### Chaves a Adicionar

```json
{
  "comparison": {
    "title": "Comparação de Fotos",
    "close": "Fechar",
    "previous": "Anterior",
    "next": "Próxima",
    "photoCount": "Foto {current} de {total}",
    "before": "Original",
    "after": "Melhorada",
    "improvements": {
      "title": "Melhorias Aplicadas",
      "lighting": "Correção de iluminação e balanço de cor",
      "skin": "Suavização de pele e redução de ruído",
      "details": "Aprimoramento de detalhes e nitidez",
      "colors": "Otimização de cores e saturação"
    },
    "download": "Download Foto Melhorada",
    "viewComparison": "Ver Comparação"
  }
}
```

---

## 🧪 FASE 8: Testes e Validação

### Checklist de Funcionalidades

- [ ] Click em foto melhorada abre modal
- [ ] Slider pode ser arrastado com mouse
- [ ] Slider pode ser arrastado com toque (mobile)
- [ ] Posição inicial do slider é 50%
- [ ] Navegação entre fotos funciona (prev/next)
- [ ] Botão de download funciona
- [ ] Modal fecha com click no backdrop
- [ ] Modal fecha com tecla ESC
- [ ] Modal fecha com botão X
- [ ] Body scroll é desabilitado quando modal está aberto
- [ ] Animações de entrada/saída são suaves
- [ ] Labels "Antes/Depois" são visíveis
- [ ] Metadados das melhorias são exibidos

### Checklist de Responsividade

- [ ] Desktop (>1024px): Layout lado a lado
- [ ] Tablet (768px-1024px): Layout adaptado
- [ ] Mobile (<768px): Layout fullscreen
- [ ] Touch events funcionam em dispositivos móveis
- [ ] Imagens mantêm proporção em todos os tamanhos

### Checklist de Acessibilidade

- [ ] Modal pode ser fechado com teclado (ESC)
- [ ] Foco é capturado dentro do modal
- [ ] Imagens têm alt text apropriado
- [ ] Botões têm labels descritivos
- [ ] Slider pode ser controlado por teclado (setas)
- [ ] Role="button" em elementos clicáveis

### Checklist de Performance

- [ ] Imagens são carregadas eficientemente
- [ ] Não há memory leaks (listeners são removidos)
- [ ] Animações são fluidas (60fps)
- [ ] Modal não causa re-renders desnecessários

---

| Fase      | Descrição                         | Linhas          | Tempo         |
| --------- | --------------------------------- | --------------- | ------------- |
| 1         | BeforeAfterSlider Component       | ~150            | 45 min        |
| 2         | BeforeAfterModal Component        | ~180            | 1h            |
| 3         | Hook useInvitationForm            | ~60             | 20 min        |
| 4         | InvitationFormSection Integration | ~40             | 15 min        |
| 5         | page.tsx Update                   | ~5              | 5 min         |
| 6         | CSS Styles                        | ~250            | 1h            |
| 7         | Translations                      | ~30             | 15 min        |
| 8         | Testing & Validation              | -               | 45 min        |
| **TOTAL** | **8 fases**                       | **~715 linhas** | **~4h 30min** |

---

## 🎯 Ordem de Execução Recomendada

1. **FASE 1** → Criar BeforeAfterSlider (componente base)
2. **FASE 6** → Criar estilos CSS (para visualizar componentes)
3. **FASE 2** → Criar BeforeAfterModal (componente container)
4. **FASE 7** → Adicionar traduções
5. **FASE 3** → Atualizar hook com estado do modal
6. **FASE 4** → Integrar modal no formulário
7. **FASE 5** → Conectar no page.tsx
8. **FASE 8** → Testes completos

---

## 🎨 Design de Referência

### Slider Handle

```
     │
     │
   ┌───┐
   │ ↔ │  ← Botão circular com ícone
   └───┘
     │
     │
```

### Layout do Modal (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  ✕ Comparação de Fotos                    ← Foto 1/3 → │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                [Before/After Slider]                    │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  📊 Melhorias Aplicadas:                                │
│  • Correção de iluminação e balanço de cor             │
│  • Suavização de pele e redução de ruído               │
│  • Aprimoramento de detalhes e nitidez                 │
│  • Otimização de cores e saturação                     │
│                                                         │
│  [⬇ Download]    [← Anterior]    [Próxima →]          │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Futuras (Opcional)

- [ ] Adicionar zoom na imagem dentro do modal
- [ ] Permitir arrastar para fechar o modal (swipe down)
- [ ] Adicionar indicador de loading enquanto imagens carregam
- [ ] Exibir metadados EXIF da foto original
- [ ] Adicionar botão para copiar link da foto
- [ ] Implementar compartilhamento social
- [ ] Adicionar histórico de melhorias (versioning)
- [ ] Permitir ajustes manuais no slider (fine-tuning)

---

## 🔐 Notas Técnicas

### Libs Necessárias

- Todas as dependências já estão disponíveis no projeto
- Usar `lucide-react` para ícones (ArrowLeftRight, Eye, Download, X, ChevronLeft, ChevronRight)

### Performance

- Usar `React.memo` no BeforeAfterSlider para evitar re-renders
- Debounce no movimento do slider se necessário
- Lazy load do modal (só carregar quando abrir pela primeira vez)

### Acessibilidade

- `role="dialog"` no modal
- `aria-modal="true"` no modal
- `aria-label` nos botões de navegação
- Trap focus dentro do modal quando aberto
- Retornar foco ao elemento que abriu o modal ao fechar

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Fallback para navegadores sem suporte a `clip-path`

---

**Status**: ⏳ Aguardando execução
**Prioridade**: 🔵 Média (feature de UX enhancement)
**Complexidade**: 🟡 Média (manipulação de eventos, animações, state management)
