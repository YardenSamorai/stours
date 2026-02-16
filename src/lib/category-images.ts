/**
 * SVG-generated category images - 100% copyright-free
 * All images are generated as SVG code, no external dependencies
 */

export interface CategoryImage {
  id: string;
  svg: string; // SVG code as string
  description: string;
  tags: string[];
}

// Beach / חוף - SVG
export const beachImages: CategoryImage[] = [
  {
    id: 'beach-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beach-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="beach-sand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#F4E4BC;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E8D5A3;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="beach-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2E5C8A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#beach-sky)"/>
      <ellipse cx="400" cy="300" rx="350" ry="200" fill="url(#beach-water)"/>
      <path d="M 0 400 Q 200 380 400 400 T 800 400 L 800 600 L 0 600 Z" fill="url(#beach-sand)"/>
      <circle cx="150" cy="120" r="40" fill="#FFD700" opacity="0.9"/>
      <path d="M 200 200 Q 250 180 300 200 T 400 200" stroke="#87CEEB" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 500 180 Q 550 160 600 180 T 700 180" stroke="#87CEEB" stroke-width="3" fill="none" opacity="0.6"/>
    </svg>`,
    description: 'Tropical beach with palm trees',
    tags: ['beach', 'tropical', 'ocean', 'palm trees'],
  },
  {
    id: 'beach-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beach2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="beach2-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#5B9BD5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2E5C8A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#beach2-sky)"/>
      <ellipse cx="400" cy="350" rx="400" ry="250" fill="url(#beach2-water)"/>
      <circle cx="400" cy="100" r="50" fill="#FFD700" opacity="0.95"/>
      <path d="M 0 450 Q 200 430 400 450 T 800 450 L 800 600 L 0 600 Z" fill="#F4E4BC"/>
      <path d="M 100 300 Q 150 280 200 300 T 300 300" stroke="#87CEEB" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M 500 280 Q 550 260 600 280 T 700 280" stroke="#87CEEB" stroke-width="4" fill="none" opacity="0.7"/>
    </svg>`,
    description: 'Beach sunset scene',
    tags: ['beach', 'sunset', 'ocean', 'golden hour'],
  },
  {
    id: 'beach-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beach3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#beach3-sky)"/>
      <ellipse cx="400" cy="400" rx="450" ry="200" fill="#4A90E2"/>
      <path d="M 0 500 Q 200 480 400 500 T 800 500 L 800 600 L 0 600 Z" fill="#F4E4BC"/>
      <circle cx="200" cy="150" r="35" fill="#FFD700" opacity="0.85"/>
      <path d="M 300 250 Q 350 230 400 250 T 500 250" stroke="#5B9BD5" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 600 230 Q 650 210 700 230 T 750 230" stroke="#5B9BD5" stroke-width="3" fill="none" opacity="0.6"/>
    </svg>`,
    description: 'Crystal clear blue ocean',
    tags: ['beach', 'ocean', 'blue', 'clear water'],
  },
];

// Mountains / הרים - SVG
export const mountainImages: CategoryImage[] = [
  {
    id: 'mountain-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mountain-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mountain-sky)"/>
      <path d="M 0 600 L 0 400 L 200 300 L 400 200 L 600 250 L 800 180 L 800 600 Z" fill="#8B9DC3"/>
      <path d="M 0 600 L 0 450 L 150 400 L 300 350 L 500 300 L 700 280 L 800 250 L 800 600 Z" fill="#6B7FA4"/>
      <path d="M 0 600 L 0 500 L 100 480 L 250 450 L 450 400 L 650 380 L 800 350 L 800 600 Z" fill="#4A5F7F"/>
      <circle cx="400" cy="100" r="40" fill="#FFD700" opacity="0.9"/>
      <ellipse cx="400" cy="500" rx="200" ry="50" fill="#90EE90" opacity="0.6"/>
    </svg>`,
    description: 'Snow-capped mountain peaks',
    tags: ['mountain', 'snow', 'peaks', 'alpine'],
  },
  {
    id: 'mountain-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mountain2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mountain2-sky)"/>
      <path d="M 0 600 L 0 350 L 150 300 L 300 250 L 500 200 L 700 220 L 800 180 L 800 600 Z" fill="#6B7FA4"/>
      <path d="M 0 600 L 0 450 L 200 400 L 400 350 L 600 320 L 800 300 L 800 600 Z" fill="#4A5F7F"/>
      <ellipse cx="400" cy="450" rx="250" ry="80" fill="#4682B4" opacity="0.7"/>
      <circle cx="400" cy="120" r="45" fill="#FFD700" opacity="0.95"/>
    </svg>`,
    description: 'Mountain range with lake',
    tags: ['mountain', 'lake', 'landscape', 'nature'],
  },
  {
    id: 'mountain-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mountain3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mountain3-sky)"/>
      <path d="M 0 600 L 0 380 L 180 320 L 360 280 L 540 240 L 720 260 L 800 220 L 800 600 Z" fill="#8B9DC3"/>
      <path d="M 0 600 L 0 480 L 160 440 L 320 400 L 480 380 L 640 360 L 800 340 L 800 600 Z" fill="#6B7FA4"/>
      <ellipse cx="400" cy="480" rx="300" ry="100" fill="#4682B4" opacity="0.8"/>
      <circle cx="200" cy="150" r="30" fill="#FFD700" opacity="0.85"/>
    </svg>`,
    description: 'Mountain lake reflection',
    tags: ['mountain', 'lake', 'reflection', 'serene'],
  },
];

// Desert / מדבר - SVG
export const desertImages: CategoryImage[] = [
  {
    id: 'desert-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="desert-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="desert-sand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#F4A460;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#desert-sky)"/>
      <path d="M 0 400 Q 200 350 400 380 T 800 400 L 800 600 L 0 600 Z" fill="url(#desert-sand)"/>
      <path d="M 0 450 Q 150 420 300 440 T 600 450 T 800 460 L 800 600 L 0 600 Z" fill="#D2B48C"/>
      <circle cx="400" cy="120" r="50" fill="#FFD700" opacity="0.95"/>
      <ellipse cx="200" cy="500" rx="80" ry="30" fill="#8B7355" opacity="0.7"/>
      <ellipse cx="600" cy="480" rx="60" ry="25" fill="#8B7355" opacity="0.7"/>
    </svg>`,
    description: 'Desert dunes at sunset',
    tags: ['desert', 'dunes', 'sand', 'sunset'],
  },
  {
    id: 'desert-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="desert2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE4B5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F4A460;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#desert2-sky)"/>
      <path d="M 0 500 Q 200 450 400 480 T 800 500 L 800 600 L 0 600 Z" fill="#DEB887"/>
      <path d="M 0 550 Q 250 500 500 530 T 800 550 L 800 600 L 0 600 Z" fill="#D2B48C"/>
      <circle cx="400" cy="100" r="45" fill="#FFD700" opacity="0.9"/>
      <path d="M 150 450 L 180 350 L 200 450 Z" fill="#228B22" opacity="0.8"/>
      <path d="M 600 430 L 620 330 L 640 430 Z" fill="#228B22" opacity="0.8"/>
      <path d="M 750 440 L 770 340 L 790 440 Z" fill="#228B22" opacity="0.8"/>
    </svg>`,
    description: 'Desert landscape with cacti',
    tags: ['desert', 'cactus', 'arid', 'landscape'],
  },
  {
    id: 'desert-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="desert3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#CD853F;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#desert3-sky)"/>
      <path d="M 0 500 Q 300 400 600 450 T 800 500 L 800 600 L 0 600 Z" fill="#A0522D"/>
      <path d="M 0 550 Q 200 500 400 520 T 800 550 L 800 600 L 0 600 Z" fill="#8B4513"/>
      <circle cx="400" cy="130" r="40" fill="#FFD700" opacity="0.9"/>
      <rect x="300" y="400" width="200" height="150" rx="10" fill="#654321" opacity="0.8"/>
      <rect x="320" y="420" width="30" height="40" fill="#8B4513"/>
      <rect x="450" y="420" width="30" height="40" fill="#8B4513"/>
    </svg>`,
    description: 'Red desert rock formations',
    tags: ['desert', 'rocks', 'red', 'monument valley'],
  },
];

// Mosque / מסגד - SVG
export const mosqueImages: CategoryImage[] = [
  {
    id: 'mosque-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mosque-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mosque-sky)"/>
      <rect x="300" y="300" width="200" height="200" fill="#4682B4"/>
      <path d="M 300 300 L 400 200 L 500 300 Z" fill="#1E3A8A"/>
      <rect x="350" y="350" width="100" height="150" fill="#2E5C8A"/>
      <circle cx="400" cy="250" r="15" fill="#FFD700"/>
      <rect x="320" y="280" width="20" height="20" fill="#1E3A8A"/>
      <rect x="460" y="280" width="20" height="20" fill="#1E3A8A"/>
      <rect x="250" y="400" width="30" height="100" fill="#4682B4"/>
      <rect x="520" y="400" width="30" height="100" fill="#4682B4"/>
      <circle cx="265" cy="420" r="8" fill="#FFD700"/>
      <circle cx="535" cy="420" r="8" fill="#FFD700"/>
      <ellipse cx="400" cy="500" rx="250" ry="50" fill="#90EE90" opacity="0.5"/>
    </svg>`,
    description: 'Beautiful mosque architecture',
    tags: ['mosque', 'islamic', 'architecture', 'dome'],
  },
  {
    id: 'mosque-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mosque2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mosque2-sky)"/>
      <rect x="280" y="320" width="240" height="180" fill="#4169E1"/>
      <path d="M 280 320 L 400 180 L 520 320 Z" fill="#1E3A8A"/>
      <ellipse cx="400" cy="200" rx="60" ry="40" fill="#FFD700"/>
      <rect x="350" y="380" width="100" height="120" fill="#2E5C8A"/>
      <rect x="300" y="340" width="30" height="30" fill="#1E3A8A"/>
      <rect x="470" y="340" width="30" height="30" fill="#1E3A8A"/>
      <rect x="220" y="420" width="40" height="80" fill="#4169E1"/>
      <rect x="540" y="420" width="40" height="80" fill="#4169E1"/>
      <circle cx="240" cy="440" r="10" fill="#FFD700"/>
      <circle cx="560" cy="440" r="10" fill="#FFD700"/>
      <circle cx="400" cy="100" r="40" fill="#FFD700" opacity="0.9"/>
    </svg>`,
    description: 'Blue mosque with minarets',
    tags: ['mosque', 'blue', 'minarets', 'istanbul'],
  },
  {
    id: 'mosque-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mosque3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#mosque3-sky)"/>
      <rect x="250" y="350" width="300" height="200" fill="#5B9BD5"/>
      <path d="M 250 350 L 400 200 L 550 350 Z" fill="#2E5C8A"/>
      <ellipse cx="400" cy="220" rx="50" ry="35" fill="#FFD700"/>
      <rect x="350" y="420" width="100" height="130" fill="#2E5C8A"/>
      <rect x="280" y="370" width="40" height="40" fill="#1E3A8A"/>
      <rect x="480" y="370" width="40" height="40" fill="#1E3A8A"/>
      <rect x="180" y="450" width="50" height="100" fill="#5B9BD5"/>
      <rect x="570" y="450" width="50" height="100" fill="#5B9BD5"/>
      <circle cx="205" cy="470" r="12" fill="#FFD700"/>
      <circle cx="595" cy="470" r="12" fill="#FFD700"/>
    </svg>`,
    description: 'Historic mosque interior',
    tags: ['mosque', 'interior', 'historic', 'ornate'],
  },
];

// Pyramid / פירמידות - SVG
export const pyramidImages: CategoryImage[] = [
  {
    id: 'pyramid-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyramid-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="pyramid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F4A460;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pyramid-sky)"/>
      <path d="M 200 500 L 400 200 L 600 500 Z" fill="url(#pyramid-grad)"/>
      <path d="M 200 500 L 400 200 L 600 500" stroke="#CD853F" stroke-width="2" fill="none"/>
      <path d="M 350 500 L 400 200 L 450 500" stroke="#8B7355" stroke-width="1" fill="none" opacity="0.6"/>
      <ellipse cx="400" cy="500" rx="300" ry="80" fill="#90EE90" opacity="0.4"/>
      <circle cx="400" cy="120" r="35" fill="#FFD700" opacity="0.9"/>
    </svg>`,
    description: 'Great Pyramid of Giza',
    tags: ['pyramid', 'egypt', 'giza', 'ancient'],
  },
  {
    id: 'pyramid-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyramid2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pyramid2-sky)"/>
      <path d="M 150 500 L 350 250 L 550 500 Z" fill="#F4A460"/>
      <path d="M 400 500 L 550 300 L 700 500 Z" fill="#DEB887"/>
      <path d="M 150 500 L 350 250 L 550 500" stroke="#CD853F" stroke-width="2" fill="none"/>
      <path d="M 400 500 L 550 300 L 700 500" stroke="#8B7355" stroke-width="2" fill="none"/>
      <circle cx="400" cy="100" r="45" fill="#FFD700" opacity="0.95"/>
      <ellipse cx="400" cy="500" rx="350" ry="70" fill="#D2B48C" opacity="0.6"/>
    </svg>`,
    description: 'Pyramids at sunset',
    tags: ['pyramid', 'sunset', 'egypt', 'golden'],
  },
  {
    id: 'pyramid-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyramid3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pyramid3-sky)"/>
      <path d="M 250 500 L 400 220 L 550 500 Z" fill="#F4A460"/>
      <path d="M 250 500 L 400 220 L 550 500" stroke="#CD853F" stroke-width="3" fill="none"/>
      <path d="M 300 500 L 400 280 L 500 500" stroke="#8B7355" stroke-width="1" fill="none" opacity="0.5"/>
      <ellipse cx="400" cy="500" rx="250" ry="60" fill="#90EE90" opacity="0.5"/>
      <circle cx="200" cy="150" r="30" fill="#FFD700" opacity="0.85"/>
      <ellipse cx="600" cy="480" rx="40" ry="20" fill="#8B7355" opacity="0.7"/>
    </svg>`,
    description: 'Pyramid with camels',
    tags: ['pyramid', 'camels', 'desert', 'egypt'],
  },
];

// Tower / מגדל - SVG
export const towerImages: CategoryImage[] = [
  {
    id: 'tower-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tower-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#tower-sky)"/>
      <rect x="380" y="200" width="40" height="300" fill="#C0C0C0"/>
      <rect x="370" y="200" width="60" height="20" fill="#808080"/>
      <rect x="375" y="220" width="50" height="20" fill="#A0A0A0"/>
      <rect x="375" y="260" width="50" height="20" fill="#A0A0A0"/>
      <rect x="375" y="300" width="50" height="20" fill="#A0A0A0"/>
      <rect x="375" y="340" width="50" height="20" fill="#A0A0A0"/>
      <rect x="375" y="380" width="50" height="20" fill="#A0A0A0"/>
      <rect x="360" y="480" width="80" height="20" fill="#808080"/>
      <ellipse cx="400" cy="500" rx="200" ry="50" fill="#90EE90" opacity="0.5"/>
      <circle cx="200" cy="120" r="25" fill="#FFD700" opacity="0.8"/>
    </svg>`,
    description: 'Eiffel Tower, Paris',
    tags: ['tower', 'eiffel', 'paris', 'france'],
  },
  {
    id: 'tower-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tower2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#tower2-sky)"/>
      <rect x="350" y="150" width="100" height="350" fill="#708090"/>
      <rect x="340" y="150" width="120" height="30" fill="#556B2F"/>
      <rect x="360" y="200" width="80" height="20" fill="#2F4F4F"/>
      <rect x="360" y="250" width="80" height="20" fill="#2F4F4F"/>
      <rect x="360" y="300" width="80" height="20" fill="#2F4F4F"/>
      <rect x="360" y="350" width="80" height="20" fill="#2F4F4F"/>
      <rect x="360" y="400" width="80" height="20" fill="#2F4F4F"/>
      <rect x="330" y="480" width="140" height="20" fill="#556B2F"/>
      <circle cx="400" cy="100" r="40" fill="#FFD700" opacity="0.95"/>
    </svg>`,
    description: 'Modern skyscraper',
    tags: ['tower', 'skyscraper', 'modern', 'city'],
  },
  {
    id: 'tower-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tower3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#tower3-sky)"/>
      <rect x="370" y="180" width="60" height="320" fill="#8B7355"/>
      <rect x="360" y="180" width="80" height="25" fill="#654321"/>
      <rect x="375" y="220" width="50" height="15" fill="#654321"/>
      <rect x="375" y="260" width="50" height="15" fill="#654321"/>
      <rect x="375" y="300" width="50" height="15" fill="#654321"/>
      <rect x="375" y="340" width="50" height="15" fill="#654321"/>
      <rect x="375" y="380" width="50" height="15" fill="#654321"/>
      <rect x="350" y="480" width="100" height="20" fill="#654321"/>
      <ellipse cx="400" cy="500" rx="250" ry="60" fill="#90EE90" opacity="0.5"/>
      <circle cx="200" cy="130" r="28" fill="#FFD700" opacity="0.85"/>
    </svg>`,
    description: 'Historic tower architecture',
    tags: ['tower', 'historic', 'architecture', 'europe'],
  },
];

// City / עיר - SVG
export const cityImages: CategoryImage[] = [
  {
    id: 'city-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="city-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#city-sky)"/>
      <rect x="100" y="300" width="80" height="200" fill="#708090"/>
      <rect x="200" y="250" width="100" height="250" fill="#808080"/>
      <rect x="320" y="200" width="120" height="300" fill="#696969"/>
      <rect x="460" y="280" width="90" height="220" fill="#778899"/>
      <rect x="570" y="220" width="110" height="280" fill="#708090"/>
      <rect x="700" y="300" width="80" height="200" fill="#808080"/>
      <rect x="120" y="320" width="20" height="20" fill="#FFD700"/>
      <rect x="220" y="270" width="20" height="20" fill="#FFD700"/>
      <rect x="340" y="220" width="20" height="20" fill="#FFD700"/>
      <rect x="480" y="300" width="20" height="20" fill="#FFD700"/>
      <rect x="590" y="240" width="20" height="20" fill="#FFD700"/>
      <rect x="720" y="320" width="20" height="20" fill="#FFD700"/>
    </svg>`,
    description: 'Modern city skyline',
    tags: ['city', 'skyline', 'urban', 'modern'],
  },
  {
    id: 'city-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="city2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#city2-sky)"/>
      <rect x="150" y="350" width="100" height="150" fill="#8B7355"/>
      <rect x="280" y="320" width="120" height="180" fill="#A0522D"/>
      <rect x="430" y="300" width="110" height="200" fill="#8B7355"/>
      <rect x="570" y="340" width="100" height="160" fill="#A0522D"/>
      <path d="M 150 350 L 200 280 L 250 350 Z" fill="#654321"/>
      <path d="M 280 320 L 340 240 L 400 320 Z" fill="#5C4033"/>
      <path d="M 430 300 L 485 220 L 540 300 Z" fill="#654321"/>
      <path d="M 570 340 L 620 270 L 670 340 Z" fill="#5C4033"/>
      <circle cx="400" cy="100" r="40" fill="#FFD700" opacity="0.95"/>
    </svg>`,
    description: 'Historic city center',
    tags: ['city', 'historic', 'old town', 'europe'],
  },
  {
    id: 'city-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="city3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#000033;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#city3-sky)"/>
      <rect x="120" y="320" width="70" height="180" fill="#2F4F4F"/>
      <rect x="210" y="280" width="90" height="220" fill="#1C1C1C"/>
      <rect x="320" y="250" width="110" height="250" fill="#2F4F4F"/>
      <rect x="450" y="300" width="100" height="200" fill="#1C1C1C"/>
      <rect x="570" y="270" width="120" height="230" fill="#2F4F4F"/>
      <rect x="140" y="340" width="15" height="15" fill="#FFD700"/>
      <rect x="230" y="300" width="15" height="15" fill="#FFD700"/>
      <rect x="340" y="270" width="15" height="15" fill="#FFD700"/>
      <rect x="470" y="320" width="15" height="15" fill="#FFD700"/>
      <rect x="590" y="290" width="15" height="15" fill="#FFD700"/>
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="150" cy="80" r="2" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="250" cy="60" r="2.5" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="700" cy="70" r="2" fill="#FFFFFF" opacity="0.8"/>
    </svg>`,
    description: 'City at night',
    tags: ['city', 'night', 'lights', 'urban'],
  },
];

// Nature / טבע - SVG
export const natureImages: CategoryImage[] = [
  {
    id: 'nature-1',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nature-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#nature-sky)"/>
      <ellipse cx="200" cy="500" rx="80" ry="100" fill="#228B22" opacity="0.8"/>
      <ellipse cx="300" cy="480" rx="100" ry="120" fill="#32CD32" opacity="0.8"/>
      <ellipse cx="500" cy="490" rx="90" ry="110" fill="#228B22" opacity="0.8"/>
      <ellipse cx="650" cy="500" rx="70" ry="90" fill="#32CD32" opacity="0.8"/>
      <rect x="190" y="480" width="20" height="120" fill="#8B4513"/>
      <rect x="290" y="460" width="20" height="140" fill="#8B4513"/>
      <rect x="490" y="470" width="20" height="130" fill="#8B4513"/>
      <rect x="640" y="480" width="20" height="110" fill="#8B4513"/>
      <path d="M 0 550 Q 200 520 400 540 T 800 550 L 800 600 L 0 600 Z" fill="#90EE90"/>
      <circle cx="400" cy="120" r="35" fill="#FFD700" opacity="0.9"/>
    </svg>`,
    description: 'Forest path',
    tags: ['nature', 'forest', 'trees', 'path'],
  },
  {
    id: 'nature-2',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nature2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0F6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8E0F2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#nature2-sky)"/>
      <path d="M 300 600 L 350 200 L 400 600 Z" fill="#228B22"/>
      <path d="M 400 600 L 450 180 L 500 600 Z" fill="#32CD32"/>
      <path d="M 500 600 L 550 220 L 600 600 Z" fill="#228B22"/>
      <rect x="340" y="200" width="15" height="400" fill="#8B4513"/>
      <rect x="440" y="180" width="15" height="420" fill="#8B4513"/>
      <rect x="540" y="220" width="15" height="380" fill="#8B4513"/>
      <path d="M 200 400 Q 300 300 400 400 T 600 400" stroke="#4682B4" stroke-width="8" fill="none"/>
      <path d="M 250 450 Q 350 350 450 450 T 650 450" stroke="#5B9BD5" stroke-width="6" fill="none"/>
      <ellipse cx="400" cy="500" rx="300" ry="80" fill="#90EE90" opacity="0.6"/>
    </svg>`,
    description: 'Waterfall in nature',
    tags: ['nature', 'waterfall', 'water', 'green'],
  },
  {
    id: 'nature-3',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nature3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#nature3-sky)"/>
      <path d="M 0 600 L 0 400 L 200 300 L 400 250 L 600 280 L 800 240 L 800 600 Z" fill="#8B9DC3"/>
      <ellipse cx="400" cy="450" rx="350" ry="120" fill="#4682B4" opacity="0.8"/>
      <ellipse cx="200" cy="480" rx="60" ry="80" fill="#228B22" opacity="0.7"/>
      <ellipse cx="600" cy="470" rx="50" ry="70" fill="#32CD32" opacity="0.7"/>
      <rect x="190" y="460" width="20" height="100" fill="#8B4513"/>
      <rect x="590" y="450" width="20" height="100" fill="#8B4513"/>
      <circle cx="200" cy="150" r="30" fill="#FFD700" opacity="0.85"/>
    </svg>`,
    description: 'Mountain lake',
    tags: ['nature', 'lake', 'mountain', 'serene'],
  },
];

// All images grouped by category
export const categoryImageLibrary: Record<string, CategoryImage[]> = {
  beach: beachImages,
  mountain: mountainImages,
  desert: desertImages,
  mosque: mosqueImages,
  pyramid: pyramidImages,
  tower: towerImages,
  city: cityImages,
  nature: natureImages,
};

// All images in one array
export const allCategoryImages: CategoryImage[] = [
  ...beachImages,
  ...mountainImages,
  ...desertImages,
  ...mosqueImages,
  ...pyramidImages,
  ...towerImages,
  ...cityImages,
  ...natureImages,
];

// Get images by category name (fuzzy match)
export function getImagesForCategory(categoryName: string): CategoryImage[] {
  const lowerName = categoryName.toLowerCase();
  
  // Direct match
  if (categoryImageLibrary[lowerName]) {
    return categoryImageLibrary[lowerName];
  }
  
  // Fuzzy matching
  if (lowerName.includes('חוף') || lowerName.includes('beach')) {
    return beachImages;
  }
  if (lowerName.includes('הר') || lowerName.includes('mountain')) {
    return mountainImages;
  }
  if (lowerName.includes('מדבר') || lowerName.includes('desert')) {
    return desertImages;
  }
  if (lowerName.includes('מסגד') || lowerName.includes('mosque')) {
    return mosqueImages;
  }
  if (lowerName.includes('פירמיד') || lowerName.includes('pyramid')) {
    return pyramidImages;
  }
  if (lowerName.includes('מגדל') || lowerName.includes('tower')) {
    return towerImages;
  }
  if (lowerName.includes('עיר') || lowerName.includes('city')) {
    return cityImages;
  }
  if (lowerName.includes('טבע') || lowerName.includes('nature')) {
    return natureImages;
  }
  
  // Default: return all images
  return allCategoryImages;
}
