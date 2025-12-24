# Claude Code Skills Collection

> **As Seen On**: [Build Nano Banana Pro Apps 10x Faster (Claude Code Skill)](https://www.youtube.com/watch?v=7wPZYk8B6rw)
>
> **Want the skill-creator-plus skill?** Get it from [BuilderPack.ai](https://builderpack.ai/?utm_source=github&utm_medium=readme&utm_campaign=claude_17) or just the [Claude Code Pack](https://builderpack.ai/claude?utm_source=github&utm_medium=readme&utm_campaign=claude_17)

Two specialized skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) built with the skill-creator-plus—demonstrating how to create high-quality, reusable skills for specific domains.

---

## What's Inside

This repository contains **two custom skills** and the **prompts used to build a complete demo app** with them. The skills were created using the skill-creator-plus and demonstrate domain-specific patterns for building production apps with Claude.

### Skills (`.claude/skills/`)

| Skill | Description |
|-------|-------------|
| **nano-banana-builder** | Build full-stack web apps powered by Google Gemini's image generation APIs (`gemini-2.5-flash-image` and `gemini-3-pro-image-preview`). Covers server actions, API routes, storage, rate limiting, and conversational image editing patterns. |
| **threejs-builder** | Create simple, performant Three.js web applications using modern ES module patterns. Includes scene setup, lighting, geometries, materials, animations, and responsive rendering. |
| **frontend-design** | (from [Anthropic](https://github.com/anthropics/skills)) Create distinctive frontend interfaces with high design quality and distinctive aesthetics. |

### Prompts (`/prompts/`)

These prompts were used sequentially to build the demo app (a Chinese New Year card generator):

| Prompt | What It Does |
|--------|--------------|
| `01-nanobanana.txt` | Creates the MVP: upload selfie → generate festive card using Gemini |
| `02-threejs.txt` | Adds 3D preview: card folds out with Three.js and OrbitControls |
| `03-frontend-design.txt` | Polishes the UI: transforms basic app into visually striking design |

---

## How These Skills Were Built

Both **nano-banana-builder** and **threejs-builder** were created using the [skill-creator-plus](https://builderpack.ai) — a Claude Code skill for building other skills. They demonstrate how to author domain-specific skills that provide:

- Exact model/library references (no guessing or hallucinating)
- Anti-patterns section to prevent common mistakes
- Real working examples with production patterns
- Philosophy & mental models for the domain

---

## Using the Skills

### Installation

Copy the `.claude/skills/` directory into your project:

```bash
cp -r .claude/skills/ your-project/.claude/skills/
```

Or clone and copy specific skills:

```bash
git clone https://github.com/user/repo.git
cp -r repo/.claude/skills/frontend-design your-project/.claude/skills/
```

### Invoking Skills

Once installed, invoke skills in Claude Code:

```
/frontend-design   # Create distinctive UI components
/nano-banana-builder   # Build Gemini image generation apps
/threejs-builder   # Create Three.js 3D scenes
```

Or reference them in prompts:

```
Use the frontend-design skill to redesign this login page.
```

---

## Skill Highlights

### nano-banana-builder

- **Exact model names**: `gemini-2.5-flash-image` (fast) and `gemini-3-pro-image-preview` (quality)
- **Conversational approach**: Multi-turn editing, context awareness, iterative refinement
- **Production patterns**: Rate limiting, storage strategies, error handling
- **Anti-patterns**: Warns against common mistakes like wrong model names or missing loading states

### threejs-builder

- **Scene graph mental model**: Hierarchical object relationships
- **Modern patterns**: ES modules, `setAnimationLoop`, OrbitControls from addons
- **Performance focus**: Geometry reuse, pixelRatio capping, appropriate segment counts
- **Common recipes**: Rotating cube, particle fields, animated backgrounds

---

## The Demo App

The included Next.js app demonstrates all three skills working together:

1. **Upload**: User uploads a selfie
2. **Generate**: Gemini creates a festive two-panel card image
3. **Preview**: Three.js renders an interactive 3D fold-out card
4. **Download**: User saves their personalized card

### Running the Demo

```bash
npm install
cp .env.example .env.local
# Add your GOOGLE_GENERATIVE_AI_API_KEY
npm run dev
```

---

## Repository Structure

```
.claude/
└── skills/
    ├── frontend-design/
    │   ├── SKILL.md          # Main skill definition
    │   └── LICENSE.txt
    ├── nano-banana-builder/
    │   ├── SKILL.md          # Main skill definition
    │   └── references/
    │       ├── advanced-patterns.md
    │       └── configuration.md
    └── threejs-builder/
        ├── SKILL.md          # Main skill definition
        └── references/
            └── advanced-topics.md
prompts/
├── 01-nanobanana.txt         # Step 1: Core image generation
├── 02-threejs.txt            # Step 2: 3D preview
└── 03-frontend-design.txt    # Step 3: UI polish
app/                          # Demo Next.js application
```

---

## License

Skills are provided as-is for educational and personal use. See individual `LICENSE.txt` files in skill directories for specific terms.
