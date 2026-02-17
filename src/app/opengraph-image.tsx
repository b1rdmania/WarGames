import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WAR.MARKET';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BASE = 'https://www.war.market';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080c09',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/gifs/globeLarge.gif`} width={220} height={220} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/gifs/fire1.gif`} width={220} height={220} alt="" />
      </div>
    ),
    { ...size },
  );
}
