export default function BriefingPage() {
  // Backward-compat: old briefing URL now redirects to the click-through deck.
  // Server-side redirect to avoid any flash of content.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { redirect } = require('next/navigation') as { redirect: (url: string) => never };
  redirect('/deck');
}

