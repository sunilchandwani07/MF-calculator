const svg = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" rx="40" fill="#1E3A8A"/>
  <path d="M100 40L160 70V110C160 145 135 175 100 185C65 175 40 145 40 110V70L100 40Z" fill="#10B981" fill-opacity="0.2"/>
  <path d="M100 50L150 75V105C150 135 130 160 100 170C70 160 50 135 50 105V75L100 50Z" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 130L90 110L110 120L140 90" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="140" cy="90" r="8" fill="#F59E0B"/>
</svg>`;

const base64 = Buffer.from(svg).toString('base64');
console.log(`data:image/svg+xml;base64,${base64}`);
