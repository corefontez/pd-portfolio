# Design System — Izabel Fontes Portfolio

## Color Tokens

| Token           | Value     | Usage                          |
|-----------------|-----------|--------------------------------|
| `--bg`          | `#0D0D0D` | Page background                |
| `--bg-surface`  | `#141414` | Nav, marquee strip, cards bg   |
| `--bg-card`     | `#1C1C1C` | Card surfaces, hover states    |
| `--text`        | `#ECEAE4` | Primary text (warm near-white) |
| `--text-sec`    | `#7C7A76` | Secondary text, labels         |
| `--text-muted`  | `#484644` | Indexes, muted labels          |
| `--accent`      | `#F97316` | Primary accent (orange)        |
| `--accent-low`  | `rgba(249,115,22,0.08)` | Accent backgrounds |
| `--border`      | `#252525` | Borders, dividers              |

## Typography

| Token         | Value                   |
|---------------|-------------------------|
| `--font`      | `'Archivo', sans-serif` |
| `--font-mono` | `'DM Mono', monospace`  |

- **Headings**: Archivo, weight 700 / 300 italic
- **Body**: Archivo, weight 400
- **Labels / tags**: DM Mono, size 0.7rem, letter-spacing 0.08em, uppercase

## Spacing Scale (8pt)

| Token  | Value  |
|--------|--------|
| `--s1` | 8px    |
| `--s2` | 16px   |
| `--s3` | 24px   |
| `--s4` | 32px   |
| `--s5` | 48px   |
| `--s6` | 64px   |
| `--s7` | 80px   |
| `--s8` | 120px  |

## Border Radius

| Token  | Value |
|--------|-------|
| `--r1` | 4px   |
| `--r2` | 8px   |
| `--r3` | 16px  |

## Transitions & Easing

| Token      | Value                           |
|------------|---------------------------------|
| `--ease`   | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in`| `cubic-bezier(0.65, 0, 0.35, 1)`|
| `--t-fast` | `0.15s`                         |
| `--t-med`  | `0.3s`                          |
| `--t-slow` | `0.6s`                          |

## Animations

| Name              | Description                                        |
|-------------------|----------------------------------------------------|
| Split text reveal | Words slide up from clip on scroll (IntersectionObserver) |
| Hero reveal       | Staggered word reveal on page load after loader    |
| Text scramble     | Chars randomize then resolve on work title hover   |
| Marquee           | Infinite horizontal scroll for taglines            |
| Works marquee     | Auto-scrolling project thumbnail strip             |
| Counter           | Numbers count up when stats enter viewport         |
| Cursor            | Orange dot + lagging ring follower                 |
| Loader            | Orange bar fills, then fades out                   |
| Card hover line   | Orange underline scales in from left on hover      |
| Work row reveal   | Row slides up + fades on scroll enter              |

## Breakpoints

| Name    | Width   |
|---------|---------|
| Mobile  | 480px   |
| Tablet  | 768px   |
| Desktop | 1024px  |
| Wide    | 1440px  |
