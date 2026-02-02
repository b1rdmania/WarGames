import { WarMark } from '@/components/WarMark';
import {
  IconChart,
  IconWallet,
  IconArrowUp,
  IconArrowDown,
  IconWarning,
  IconExternal,
  IconRefresh,
  IconClose,
  IconInfo,
  IconCopy,
  IconExecute,
  IconPosition,
} from '@/components/WarIcons';

export const metadata = {
  title: 'Icon Set',
  robots: 'noindex',
};

const icons = [
  { name: 'WarMark', component: WarMark, description: 'Brand mark' },
  { name: 'Chart', component: IconChart, description: 'Markets, trends' },
  { name: 'Wallet', component: IconWallet, description: 'Connect wallet' },
  { name: 'ArrowUp', component: IconArrowUp, description: 'Profit, positive' },
  { name: 'ArrowDown', component: IconArrowDown, description: 'Loss, negative' },
  { name: 'Warning', component: IconWarning, description: 'Risk, alerts' },
  { name: 'External', component: IconExternal, description: 'External links' },
  { name: 'Refresh', component: IconRefresh, description: 'Refresh action' },
  { name: 'Close', component: IconClose, description: 'Close, dismiss' },
  { name: 'Info', component: IconInfo, description: 'Information' },
  { name: 'Copy', component: IconCopy, description: 'Copy to clipboard' },
  { name: 'Execute', component: IconExecute, description: 'Trade, action' },
  { name: 'Position', component: IconPosition, description: 'Portfolio, layers' },
];

export default function IconsPage() {
  return (
    <main className="min-h-screen bg-war-deep p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">WAR.MARKET Icon Set</h1>
        <p className="text-text-secondary mb-8">
          Warm gray strokes, amber/gold accents, rounded caps, geometric forms.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {icons.map(({ name, component: Icon, description }) => (
            <div
              key={name}
              className="bg-war-warm border border-war-surface rounded-lg p-6 flex flex-col items-center gap-3"
            >
              <Icon size={48} />
              <div className="text-center">
                <div className="text-sm font-medium text-text-primary">{name}</div>
                <div className="text-xs text-text-muted">{description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-war-surface pt-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Sizes</h2>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <IconChart size={16} />
              <span className="text-xs text-text-muted">16px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconChart size={24} />
              <span className="text-xs text-text-muted">24px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconChart size={32} />
              <span className="text-xs text-text-muted">32px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconChart size={48} />
              <span className="text-xs text-text-muted">48px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconChart size={64} />
              <span className="text-xs text-text-muted">64px</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-war-surface pt-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Usage</h2>
          <pre className="bg-war-warm border border-war-surface rounded-lg p-4 text-sm text-text-secondary overflow-x-auto">
{`import { IconChart, IconWallet } from '@/components/WarIcons';

<IconChart size={24} />
<IconWallet size={32} className="opacity-60" />`}
          </pre>
        </div>
      </div>
    </main>
  );
}
