const svg = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#10B981;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="48" fill="url(#grad1)"/>
  <path d="M60 140L90 110L115 125L155 75" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M155 75L135 75M155 75L155 95" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="155" cy="75" r="6" fill="#F59E0B"/>
  <path d="M50 160H170" stroke="white" stroke-width="2" stroke-opacity="0.3"/>
</svg>`;

const base64 = Buffer.from(svg).toString('base64');
console.log(`data:image/svg+xml;base64,${base64}`);
