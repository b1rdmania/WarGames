import Link from 'next/link';

export default function IOSLandingPage() {
  return (
    <main className="min-h-screen bg-pear-dark text-white">
      <div className="mx-auto max-w-[720px] px-6 py-14">
        <div className="pear-border bg-black/40 p-6">
          <div className="text-pear-lime font-mono font-bold tracking-widest text-xl">WAR.MARKET</div>
          <div className="mt-2 text-xs font-mono text-gray-500 uppercase tracking-[0.18em]">
            SYSTEM STATUS: OPERATIONAL
          </div>

          <div className="mt-8 font-mono">
            <div className="text-2xl tracking-widest text-white">GIMME A BREAK.</div>
            <div className="mt-3 text-sm text-gray-300 leading-relaxed">
              This is a hackathon build. The terminal UI is meant for a laptop/desktop screen.
            </div>
            <div className="mt-4 text-sm text-gray-400 leading-relaxed">
              Open this on your computer for the full experience.
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <a
              className="tm-btn w-full text-center"
              href="https://war-markets.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              COPY LINK / OPEN ON DESKTOP
            </a>
            <Link className="tm-btn w-full text-center" href="/">
              BACK TO SPLASH
            </Link>
          </div>

          <div className="mt-8 text-[11px] font-mono text-gray-500">
            If you’re on iPad and want to try anyway, request the desktop site in Safari.
          </div>
        </div>
      </div>
    </main>
  );
}

