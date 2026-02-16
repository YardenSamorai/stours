/**
 * Pre-selected high-quality images for categories
 * All images from Unsplash - free to use
 */

export interface CategoryImage {
  id: string;
  url: string;
  thumbnail: string;
  photographer: string;
  description: string;
  tags: string[];
}

// Beach / חוף
export const beachImages: CategoryImage[] = [
  {
    id: 'beach-1',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Tropical beach with palm trees',
    tags: ['beach', 'tropical', 'ocean', 'palm trees'],
  },
  {
    id: 'beach-2',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Crystal clear blue ocean',
    tags: ['beach', 'ocean', 'blue', 'clear water'],
  },
  {
    id: 'beach-3',
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Sandy beach at sunset',
    tags: ['beach', 'sunset', 'sand', 'golden hour'],
  },
];

// Mountains / הרים
export const mountainImages: CategoryImage[] = [
  {
    id: 'mountain-1',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Snow-capped mountain peaks',
    tags: ['mountain', 'snow', 'peaks', 'alpine'],
  },
  {
    id: 'mountain-2',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Mountain range with lake',
    tags: ['mountain', 'lake', 'landscape', 'nature'],
  },
  {
    id: 'mountain-3',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Mountain lake reflection',
    tags: ['mountain', 'lake', 'reflection', 'serene'],
  },
];

// Desert / מדבר
export const desertImages: CategoryImage[] = [
  {
    id: 'desert-1',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Desert dunes at sunset',
    tags: ['desert', 'dunes', 'sand', 'sunset'],
  },
  {
    id: 'desert-2',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Desert landscape with cacti',
    tags: ['desert', 'cactus', 'arid', 'landscape'],
  },
  {
    id: 'desert-3',
    url: 'https://images.unsplash.com/photo-1509316975850-57e65e5c4649?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-57e65e5c4649?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Red desert rock formations',
    tags: ['desert', 'rocks', 'red', 'monument valley'],
  },
];

// Mosque / מסגד
export const mosqueImages: CategoryImage[] = [
  {
    id: 'mosque-1',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Beautiful mosque architecture',
    tags: ['mosque', 'islamic', 'architecture', 'dome'],
  },
  {
    id: 'mosque-2',
    url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Blue mosque with minarets',
    tags: ['mosque', 'blue', 'minarets', 'istanbul'],
  },
  {
    id: 'mosque-3',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Historic mosque interior',
    tags: ['mosque', 'interior', 'historic', 'ornate'],
  },
];

// Pyramid / פירמידות
export const pyramidImages: CategoryImage[] = [
  {
    id: 'pyramid-1',
    url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Great Pyramid of Giza',
    tags: ['pyramid', 'egypt', 'giza', 'ancient'],
  },
  {
    id: 'pyramid-2',
    url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Pyramids at sunset',
    tags: ['pyramid', 'sunset', 'egypt', 'golden'],
  },
  {
    id: 'pyramid-3',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Pyramid with camels',
    tags: ['pyramid', 'camels', 'desert', 'egypt'],
  },
];

// Tower / מגדל
export const towerImages: CategoryImage[] = [
  {
    id: 'tower-1',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Eiffel Tower, Paris',
    tags: ['tower', 'eiffel', 'paris', 'france'],
  },
  {
    id: 'tower-2',
    url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Modern skyscraper',
    tags: ['tower', 'skyscraper', 'modern', 'city'],
  },
  {
    id: 'tower-3',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Historic tower architecture',
    tags: ['tower', 'historic', 'architecture', 'europe'],
  },
];

// City / עיר
export const cityImages: CategoryImage[] = [
  {
    id: 'city-1',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Modern city skyline',
    tags: ['city', 'skyline', 'urban', 'modern'],
  },
  {
    id: 'city-2',
    url: 'https://images.unsplash.com/photo-1496564203459-88c0e0a0b9fd?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1496564203459-88c0e0a0b9fd?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Historic city center',
    tags: ['city', 'historic', 'old town', 'europe'],
  },
  {
    id: 'city-3',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&q=80',
    photographer: 'Unsplash',
    description: 'City at night',
    tags: ['city', 'night', 'lights', 'urban'],
  },
];

// Nature / טבע
export const natureImages: CategoryImage[] = [
  {
    id: 'nature-1',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Forest path',
    tags: ['nature', 'forest', 'trees', 'path'],
  },
  {
    id: 'nature-2',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    photographer: 'Unsplash',
    description: 'Waterfall in nature',
    tags: ['nature', 'waterfall', 'water', 'green'],
  },
  {
    id: 'nature-3',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
    photographer: 'Unsplash',
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
