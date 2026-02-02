# Icons

45 icons designed to match the war.market brand.

## Style

- Warm gray strokes (`#4a4752`)
- Amber (`#f97316`) / gold (`#fbbf24`) accents
- Profit green (`#22c55e`) / loss red (`#ef4444`) where appropriate
- Rounded caps and joins
- 64x64 viewBox, scales to any size

## Full set

### Navigation

| Icon | Name | Use |
|------|------|-----|
| ![chevron-left](/icons/chevron-left.svg){.icon-preview} | `chevron-left` | Back |
| ![chevron-right](/icons/chevron-right.svg){.icon-preview} | `chevron-right` | Forward |
| ![chevron-up](/icons/chevron-up.svg){.icon-preview} | `chevron-up` | Expand |
| ![chevron-down](/icons/chevron-down.svg){.icon-preview} | `chevron-down` | Collapse |
| ![menu](/icons/menu.svg){.icon-preview} | `menu` | Menu |
| ![close](/icons/close.svg){.icon-preview} | `close` | Close, dismiss |
| ![external](/icons/external.svg){.icon-preview} | `external` | External link |

### Trading

| Icon | Name | Use |
|------|------|-----|
| ![chart](/icons/chart.svg){.icon-preview} | `chart` | Markets, trends |
| ![candle](/icons/candle.svg){.icon-preview} | `candle` | Price chart |
| ![execute](/icons/execute.svg){.icon-preview} | `execute` | Trade action |
| ![position](/icons/position.svg){.icon-preview} | `position` | Portfolio |
| ![target](/icons/target.svg){.icon-preview} | `target` | Thesis |
| ![layers](/icons/layers.svg){.icon-preview} | `layers` | Baskets |

### Status

| Icon | Name | Use |
|------|------|-----|
| ![arrow-up](/icons/arrow-up.svg){.icon-preview} | `arrow-up` | Profit |
| ![arrow-down](/icons/arrow-down.svg){.icon-preview} | `arrow-down` | Loss |
| ![trending-up](/icons/trending-up.svg){.icon-preview} | `trending-up` | Positive trend |
| ![trending-down](/icons/trending-down.svg){.icon-preview} | `trending-down` | Negative trend |
| ![check](/icons/check.svg){.icon-preview} | `check` | Success |
| ![warning](/icons/warning.svg){.icon-preview} | `warning` | Alert |
| ![info](/icons/info.svg){.icon-preview} | `info` | Information |

### Wallet & Auth

| Icon | Name | Use |
|------|------|-----|
| ![wallet](/icons/wallet.svg){.icon-preview} | `wallet` | Connect |
| ![lock](/icons/lock.svg){.icon-preview} | `lock` | Locked |
| ![unlock](/icons/unlock.svg){.icon-preview} | `unlock` | Unlocked |
| ![shield](/icons/shield.svg){.icon-preview} | `shield` | Security |
| ![link](/icons/link.svg){.icon-preview} | `link` | Connected |
| ![disconnect](/icons/disconnect.svg){.icon-preview} | `disconnect` | Disconnect |

### Finance

| Icon | Name | Use |
|------|------|-----|
| ![dollar](/icons/dollar.svg){.icon-preview} | `dollar` | Money |
| ![percent](/icons/percent.svg){.icon-preview} | `percent` | Leverage, rates |

### Actions

| Icon | Name | Use |
|------|------|-----|
| ![refresh](/icons/refresh.svg){.icon-preview} | `refresh` | Refresh |
| ![copy](/icons/copy.svg){.icon-preview} | `copy` | Copy |
| ![search](/icons/search.svg){.icon-preview} | `search` | Search |
| ![send](/icons/send.svg){.icon-preview} | `send` | Send |
| ![plus](/icons/plus.svg){.icon-preview} | `plus` | Add |
| ![minus](/icons/minus.svg){.icon-preview} | `minus` | Remove |
| ![settings](/icons/settings.svg){.icon-preview} | `settings` | Settings |

### Utility

| Icon | Name | Use |
|------|------|-----|
| ![eye](/icons/eye.svg){.icon-preview} | `eye` | Visible |
| ![eye-off](/icons/eye-off.svg){.icon-preview} | `eye-off` | Hidden |
| ![bell](/icons/bell.svg){.icon-preview} | `bell` | Notifications |
| ![clock](/icons/clock.svg){.icon-preview} | `clock` | Time |
| ![history](/icons/history.svg){.icon-preview} | `history` | History |
| ![globe](/icons/globe.svg){.icon-preview} | `globe` | Global |
| ![book](/icons/book.svg){.icon-preview} | `book` | Docs |
| ![flag](/icons/flag.svg){.icon-preview} | `flag` | Geopolitical |

### Brand

| Icon | Name | Use |
|------|------|-----|
| ![flame](/icons/flame.svg){.icon-preview} | `flame` | Energy |
| ![diamond](/icons/diamond.svg){.icon-preview} | `diamond` | Value |

## Usage

### Direct SVG

```html
<img src="https://war.market/icons/chart.svg" width="24" height="24" alt="" />
```

### React component

```tsx
import { IconChart, IconWallet } from '@/components/WarIcons';

<IconChart size={24} />
<IconWallet size={32} className="opacity-60" />
```

### Download

All icons available at:

```
https://war.market/icons/{name}.svg
```

Or browse the folder:

```
/public/icons/
```

## Don'ts

- Don't change the colors
- Don't mix with other icon sets
- Don't add effects (shadows, glows)
- Don't use at sizes below 16px

<style>
.icon-preview {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  background: #18171c;
  border-radius: 4px;
  padding: 4px;
}
</style>
