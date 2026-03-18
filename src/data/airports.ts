export interface Airport {
  iata: string;
  name: string;
  nameHe: string;
  city: string;
  cityHe: string;
  country: string;
  countryHe: string;
}

const airports: Airport[] = [
  // ====== Israel ======
  { iata: 'TLV', name: 'Ben Gurion International', nameHe: 'נתב"ג בן גוריון', city: 'Tel Aviv', cityHe: 'תל אביב', country: 'Israel', countryHe: 'ישראל' },
  { iata: 'ETH', name: 'Ramon Airport', nameHe: 'שדה תעופה רמון', city: 'Eilat', cityHe: 'אילת', country: 'Israel', countryHe: 'ישראל' },
  { iata: 'SDV', name: 'Sde Dov', nameHe: 'שדה דב', city: 'Tel Aviv', cityHe: 'תל אביב', country: 'Israel', countryHe: 'ישראל' },
  { iata: 'HFA', name: 'Haifa Airport', nameHe: 'שדה תעופה חיפה', city: 'Haifa', cityHe: 'חיפה', country: 'Israel', countryHe: 'ישראל' },

  // ====== Greece ======
  { iata: 'ATH', name: 'Athens International', nameHe: 'נמל התעופה אתונה', city: 'Athens', cityHe: 'אתונה', country: 'Greece', countryHe: 'יוון' },
  { iata: 'SKG', name: 'Thessaloniki Airport', nameHe: 'נמל התעופה סלוניקי', city: 'Thessaloniki', cityHe: 'סלוניקי', country: 'Greece', countryHe: 'יוון' },
  { iata: 'HER', name: 'Heraklion Airport', nameHe: 'נמל התעופה הרקליון', city: 'Heraklion', cityHe: 'הרקליון', country: 'Greece', countryHe: 'יוון' },
  { iata: 'RHO', name: 'Rhodes Airport', nameHe: 'נמל התעופה רודוס', city: 'Rhodes', cityHe: 'רודוס', country: 'Greece', countryHe: 'יוון' },
  { iata: 'JTR', name: 'Santorini Airport', nameHe: 'נמל התעופה סנטוריני', city: 'Santorini', cityHe: 'סנטוריני', country: 'Greece', countryHe: 'יוון' },
  { iata: 'CFU', name: 'Corfu Airport', nameHe: 'נמל התעופה קורפו', city: 'Corfu', cityHe: 'קורפו', country: 'Greece', countryHe: 'יוון' },
  { iata: 'JMK', name: 'Mykonos Airport', nameHe: 'נמל התעופה מיקונוס', city: 'Mykonos', cityHe: 'מיקונוס', country: 'Greece', countryHe: 'יוון' },
  { iata: 'KGS', name: 'Kos Airport', nameHe: 'נמל התעופה קוס', city: 'Kos', cityHe: 'קוס', country: 'Greece', countryHe: 'יוון' },
  { iata: 'ZTH', name: 'Zakynthos Airport', nameHe: 'נמל התעופה זקינתוס', city: 'Zakynthos', cityHe: 'זקינתוס', country: 'Greece', countryHe: 'יוון' },
  { iata: 'CHQ', name: 'Chania Airport', nameHe: 'נמל התעופה חאניה', city: 'Chania', cityHe: 'חאניה', country: 'Greece', countryHe: 'יוון' },

  // ====== Cyprus ======
  { iata: 'LCA', name: 'Larnaca International', nameHe: 'נמל התעופה לרנקה', city: 'Larnaca', cityHe: 'לרנקה', country: 'Cyprus', countryHe: 'קפריסין' },
  { iata: 'PFO', name: 'Paphos Airport', nameHe: 'נמל התעופה פאפוס', city: 'Paphos', cityHe: 'פאפוס', country: 'Cyprus', countryHe: 'קפריסין' },
  { iata: 'ECN', name: 'Ercan Airport', nameHe: 'נמל התעופה ארקאן', city: 'Nicosia', cityHe: 'ניקוסיה', country: 'Cyprus', countryHe: 'קפריסין' },

  // ====== Turkey ======
  { iata: 'IST', name: 'Istanbul Airport', nameHe: 'נמל התעופה איסטנבול', city: 'Istanbul', cityHe: 'איסטנבול', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'SAW', name: 'Sabiha Gokcen', nameHe: 'סביחה גוקצ׳ן', city: 'Istanbul', cityHe: 'איסטנבול', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'AYT', name: 'Antalya Airport', nameHe: 'נמל התעופה אנטליה', city: 'Antalya', cityHe: 'אנטליה', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'ADB', name: 'Izmir Airport', nameHe: 'נמל התעופה איזמיר', city: 'Izmir', cityHe: 'איזמיר', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'DLM', name: 'Dalaman Airport', nameHe: 'נמל התעופה דלמן', city: 'Dalaman', cityHe: 'דלמן', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'BJV', name: 'Bodrum Airport', nameHe: 'נמל התעופה בודרום', city: 'Bodrum', cityHe: 'בודרום', country: 'Turkey', countryHe: 'טורקיה' },
  { iata: 'ESB', name: 'Ankara Esenboga', nameHe: 'נמל התעופה אנקרה', city: 'Ankara', cityHe: 'אנקרה', country: 'Turkey', countryHe: 'טורקיה' },

  // ====== Italy ======
  { iata: 'FCO', name: 'Rome Fiumicino', nameHe: 'רומא פיומיצ׳ינו', city: 'Rome', cityHe: 'רומא', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'CIA', name: 'Rome Ciampino', nameHe: 'רומא צ׳אמפינו', city: 'Rome', cityHe: 'רומא', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'MXP', name: 'Milan Malpensa', nameHe: 'מילאנו מלפנסה', city: 'Milan', cityHe: 'מילאנו', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'BGY', name: 'Milan Bergamo', nameHe: 'מילאנו ברגמו', city: 'Milan', cityHe: 'מילאנו', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'VCE', name: 'Venice Marco Polo', nameHe: 'ונציה מרקו פולו', city: 'Venice', cityHe: 'ונציה', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'NAP', name: 'Naples Airport', nameHe: 'נמל התעופה נאפולי', city: 'Naples', cityHe: 'נאפולי', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'FLR', name: 'Florence Airport', nameHe: 'נמל התעופה פירנצה', city: 'Florence', cityHe: 'פירנצה', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'CTA', name: 'Catania Airport', nameHe: 'נמל התעופה קטניה', city: 'Catania', cityHe: 'קטניה', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'PSA', name: 'Pisa Airport', nameHe: 'נמל התעופה פיזה', city: 'Pisa', cityHe: 'פיזה', country: 'Italy', countryHe: 'איטליה' },
  { iata: 'BRI', name: 'Bari Airport', nameHe: 'נמל התעופה בארי', city: 'Bari', cityHe: 'בארי', country: 'Italy', countryHe: 'איטליה' },

  // ====== Spain ======
  { iata: 'BCN', name: 'Barcelona El Prat', nameHe: 'ברצלונה אל פראט', city: 'Barcelona', cityHe: 'ברצלונה', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'MAD', name: 'Madrid Barajas', nameHe: 'מדריד ברחאס', city: 'Madrid', cityHe: 'מדריד', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'PMI', name: 'Palma de Mallorca', nameHe: 'פלמה דה מיורקה', city: 'Palma', cityHe: 'פלמה', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'TFS', name: 'Tenerife South', nameHe: 'טנריף דרום', city: 'Tenerife', cityHe: 'טנריף', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'AGP', name: 'Malaga Airport', nameHe: 'נמל התעופה מלאגה', city: 'Malaga', cityHe: 'מלאגה', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'IBZ', name: 'Ibiza Airport', nameHe: 'נמל התעופה איביזה', city: 'Ibiza', cityHe: 'איביזה', country: 'Spain', countryHe: 'ספרד' },
  { iata: 'ALC', name: 'Alicante Airport', nameHe: 'נמל התעופה אליקנטה', city: 'Alicante', cityHe: 'אליקנטה', country: 'Spain', countryHe: 'ספרד' },

  // ====== France ======
  { iata: 'CDG', name: 'Paris Charles de Gaulle', nameHe: 'פריז שארל דה גול', city: 'Paris', cityHe: 'פריז', country: 'France', countryHe: 'צרפת' },
  { iata: 'ORY', name: 'Paris Orly', nameHe: 'פריז אורלי', city: 'Paris', cityHe: 'פריז', country: 'France', countryHe: 'צרפת' },
  { iata: 'NCE', name: 'Nice Cote d\'Azur', nameHe: 'ניס קוט דאזור', city: 'Nice', cityHe: 'ניס', country: 'France', countryHe: 'צרפת' },
  { iata: 'MRS', name: 'Marseille Provence', nameHe: 'מרסיי פרובנס', city: 'Marseille', cityHe: 'מרסיי', country: 'France', countryHe: 'צרפת' },
  { iata: 'LYS', name: 'Lyon Saint-Exupery', nameHe: 'ליון סן אקזופרי', city: 'Lyon', cityHe: 'ליון', country: 'France', countryHe: 'צרפת' },

  // ====== UK ======
  { iata: 'LHR', name: 'London Heathrow', nameHe: 'לונדון הית׳רו', city: 'London', cityHe: 'לונדון', country: 'United Kingdom', countryHe: 'בריטניה' },
  { iata: 'LGW', name: 'London Gatwick', nameHe: 'לונדון גטוויק', city: 'London', cityHe: 'לונדון', country: 'United Kingdom', countryHe: 'בריטניה' },
  { iata: 'STN', name: 'London Stansted', nameHe: 'לונדון סטנסטד', city: 'London', cityHe: 'לונדון', country: 'United Kingdom', countryHe: 'בריטניה' },
  { iata: 'LTN', name: 'London Luton', nameHe: 'לונדון לוטון', city: 'London', cityHe: 'לונדון', country: 'United Kingdom', countryHe: 'בריטניה' },
  { iata: 'MAN', name: 'Manchester Airport', nameHe: 'נמל התעופה מנצ׳סטר', city: 'Manchester', cityHe: 'מנצ׳סטר', country: 'United Kingdom', countryHe: 'בריטניה' },
  { iata: 'EDI', name: 'Edinburgh Airport', nameHe: 'נמל התעופה אדינבורו', city: 'Edinburgh', cityHe: 'אדינבורו', country: 'United Kingdom', countryHe: 'בריטניה' },

  // ====== Germany ======
  { iata: 'FRA', name: 'Frankfurt Airport', nameHe: 'נמל התעופה פרנקפורט', city: 'Frankfurt', cityHe: 'פרנקפורט', country: 'Germany', countryHe: 'גרמניה' },
  { iata: 'MUC', name: 'Munich Airport', nameHe: 'נמל התעופה מינכן', city: 'Munich', cityHe: 'מינכן', country: 'Germany', countryHe: 'גרמניה' },
  { iata: 'BER', name: 'Berlin Brandenburg', nameHe: 'ברלין ברנדנבורג', city: 'Berlin', cityHe: 'ברלין', country: 'Germany', countryHe: 'גרמניה' },
  { iata: 'DUS', name: 'Dusseldorf Airport', nameHe: 'נמל התעופה דיסלדורף', city: 'Dusseldorf', cityHe: 'דיסלדורף', country: 'Germany', countryHe: 'גרמניה' },
  { iata: 'HAM', name: 'Hamburg Airport', nameHe: 'נמל התעופה המבורג', city: 'Hamburg', cityHe: 'המבורג', country: 'Germany', countryHe: 'גרמניה' },

  // ====== Netherlands ======
  { iata: 'AMS', name: 'Amsterdam Schiphol', nameHe: 'אמסטרדם סכיפהול', city: 'Amsterdam', cityHe: 'אמסטרדם', country: 'Netherlands', countryHe: 'הולנד' },

  // ====== Belgium ======
  { iata: 'BRU', name: 'Brussels Airport', nameHe: 'נמל התעופה בריסל', city: 'Brussels', cityHe: 'בריסל', country: 'Belgium', countryHe: 'בלגיה' },

  // ====== Austria ======
  { iata: 'VIE', name: 'Vienna Airport', nameHe: 'נמל התעופה וינה', city: 'Vienna', cityHe: 'וינה', country: 'Austria', countryHe: 'אוסטריה' },

  // ====== Switzerland ======
  { iata: 'ZRH', name: 'Zurich Airport', nameHe: 'נמל התעופה ציריך', city: 'Zurich', cityHe: 'ציריך', country: 'Switzerland', countryHe: 'שוויץ' },
  { iata: 'GVA', name: 'Geneva Airport', nameHe: 'נמל התעופה ז׳נבה', city: 'Geneva', cityHe: 'ז׳נבה', country: 'Switzerland', countryHe: 'שוויץ' },

  // ====== Portugal ======
  { iata: 'LIS', name: 'Lisbon Airport', nameHe: 'נמל התעופה ליסבון', city: 'Lisbon', cityHe: 'ליסבון', country: 'Portugal', countryHe: 'פורטוגל' },
  { iata: 'OPO', name: 'Porto Airport', nameHe: 'נמל התעופה פורטו', city: 'Porto', cityHe: 'פורטו', country: 'Portugal', countryHe: 'פורטוגל' },
  { iata: 'FAO', name: 'Faro Airport', nameHe: 'נמל התעופה פארו', city: 'Faro', cityHe: 'פארו', country: 'Portugal', countryHe: 'פורטוגל' },
  { iata: 'FNC', name: 'Funchal Madeira', nameHe: 'פונשאל מדיירה', city: 'Funchal', cityHe: 'פונשאל', country: 'Portugal', countryHe: 'פורטוגל' },

  // ====== Eastern Europe ======
  { iata: 'PRG', name: 'Prague Airport', nameHe: 'נמל התעופה פראג', city: 'Prague', cityHe: 'פראג', country: 'Czech Republic', countryHe: 'צ׳כיה' },
  { iata: 'BUD', name: 'Budapest Airport', nameHe: 'נמל התעופה בודפשט', city: 'Budapest', cityHe: 'בודפשט', country: 'Hungary', countryHe: 'הונגריה' },
  { iata: 'WAW', name: 'Warsaw Chopin', nameHe: 'ורשה שופן', city: 'Warsaw', cityHe: 'ורשה', country: 'Poland', countryHe: 'פולין' },
  { iata: 'KRK', name: 'Krakow Airport', nameHe: 'נמל התעופה קרקוב', city: 'Krakow', cityHe: 'קרקוב', country: 'Poland', countryHe: 'פולין' },
  { iata: 'OTP', name: 'Bucharest Henri Coanda', nameHe: 'בוקרשט אנרי קואנדה', city: 'Bucharest', cityHe: 'בוקרשט', country: 'Romania', countryHe: 'רומניה' },
  { iata: 'SOF', name: 'Sofia Airport', nameHe: 'נמל התעופה סופיה', city: 'Sofia', cityHe: 'סופיה', country: 'Bulgaria', countryHe: 'בולגריה' },
  { iata: 'VAR', name: 'Varna Airport', nameHe: 'נמל התעופה וארנה', city: 'Varna', cityHe: 'וארנה', country: 'Bulgaria', countryHe: 'בולגריה' },
  { iata: 'BOJ', name: 'Burgas Airport', nameHe: 'נמל התעופה בורגס', city: 'Burgas', cityHe: 'בורגס', country: 'Bulgaria', countryHe: 'בולגריה' },

  // ====== Balkan ======
  { iata: 'DBV', name: 'Dubrovnik Airport', nameHe: 'נמל התעופה דוברובניק', city: 'Dubrovnik', cityHe: 'דוברובניק', country: 'Croatia', countryHe: 'קרואטיה' },
  { iata: 'SPU', name: 'Split Airport', nameHe: 'נמל התעופה ספליט', city: 'Split', cityHe: 'ספליט', country: 'Croatia', countryHe: 'קרואטיה' },
  { iata: 'TIV', name: 'Tivat Airport', nameHe: 'נמל התעופה טיבאט', city: 'Tivat', cityHe: 'טיבאט', country: 'Montenegro', countryHe: 'מונטנגרו' },
  { iata: 'BEG', name: 'Belgrade Airport', nameHe: 'נמל התעופה בלגרד', city: 'Belgrade', cityHe: 'בלגרד', country: 'Serbia', countryHe: 'סרביה' },

  // ====== Scandinavia ======
  { iata: 'CPH', name: 'Copenhagen Airport', nameHe: 'נמל התעופה קופנהגן', city: 'Copenhagen', cityHe: 'קופנהגן', country: 'Denmark', countryHe: 'דנמרק' },
  { iata: 'OSL', name: 'Oslo Gardermoen', nameHe: 'אוסלו גרדרמואן', city: 'Oslo', cityHe: 'אוסלו', country: 'Norway', countryHe: 'נורבגיה' },
  { iata: 'ARN', name: 'Stockholm Arlanda', nameHe: 'שטוקהולם ארלנדה', city: 'Stockholm', cityHe: 'שטוקהולם', country: 'Sweden', countryHe: 'שבדיה' },
  { iata: 'HEL', name: 'Helsinki Airport', nameHe: 'נמל התעופה הלסינקי', city: 'Helsinki', cityHe: 'הלסינקי', country: 'Finland', countryHe: 'פינלנד' },
  { iata: 'KEF', name: 'Keflavik Airport', nameHe: 'נמל התעופה קפלאוויק', city: 'Reykjavik', cityHe: 'רייקיאוויק', country: 'Iceland', countryHe: 'איסלנד' },

  // ====== Egypt ======
  { iata: 'CAI', name: 'Cairo International', nameHe: 'נמל התעופה קהיר', city: 'Cairo', cityHe: 'קהיר', country: 'Egypt', countryHe: 'מצרים' },
  { iata: 'SSH', name: 'Sharm El Sheikh', nameHe: 'שארם א-שייח', city: 'Sharm El Sheikh', cityHe: 'שארם א-שייח', country: 'Egypt', countryHe: 'מצרים' },
  { iata: 'HRG', name: 'Hurghada Airport', nameHe: 'נמל התעופה הורגדה', city: 'Hurghada', cityHe: 'הורגדה', country: 'Egypt', countryHe: 'מצרים' },

  // ====== Jordan ======
  { iata: 'AMM', name: 'Queen Alia International', nameHe: 'המלכה עליא', city: 'Amman', cityHe: 'עמאן', country: 'Jordan', countryHe: 'ירדן' },
  { iata: 'AQJ', name: 'Aqaba Airport', nameHe: 'נמל התעופה עקבה', city: 'Aqaba', cityHe: 'עקבה', country: 'Jordan', countryHe: 'ירדן' },

  // ====== UAE ======
  { iata: 'DXB', name: 'Dubai International', nameHe: 'נמל התעופה דובאי', city: 'Dubai', cityHe: 'דובאי', country: 'UAE', countryHe: 'איחוד האמירויות' },
  { iata: 'AUH', name: 'Abu Dhabi Airport', nameHe: 'נמל התעופה אבו דאבי', city: 'Abu Dhabi', cityHe: 'אבו דאבי', country: 'UAE', countryHe: 'איחוד האמירויות' },

  // ====== Morocco ======
  { iata: 'RAK', name: 'Marrakech Menara', nameHe: 'מרקש מנארה', city: 'Marrakech', cityHe: 'מרקש', country: 'Morocco', countryHe: 'מרוקו' },
  { iata: 'CMN', name: 'Casablanca Mohammed V', nameHe: 'קזבלנקה מוחמד ה-5', city: 'Casablanca', cityHe: 'קזבלנקה', country: 'Morocco', countryHe: 'מרוקו' },

  // ====== USA ======
  { iata: 'JFK', name: 'New York JFK', nameHe: 'ניו יורק JFK', city: 'New York', cityHe: 'ניו יורק', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'EWR', name: 'Newark Liberty', nameHe: 'ניוארק ליברטי', city: 'New York', cityHe: 'ניו יורק', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'LAX', name: 'Los Angeles International', nameHe: 'לוס אנג׳לס', city: 'Los Angeles', cityHe: 'לוס אנג׳לס', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'MIA', name: 'Miami International', nameHe: 'מיאמי', city: 'Miami', cityHe: 'מיאמי', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'SFO', name: 'San Francisco International', nameHe: 'סן פרנסיסקו', city: 'San Francisco', cityHe: 'סן פרנסיסקו', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'ORD', name: 'Chicago O\'Hare', nameHe: 'שיקגו או׳הייר', city: 'Chicago', cityHe: 'שיקגו', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'BOS', name: 'Boston Logan', nameHe: 'בוסטון לוגן', city: 'Boston', cityHe: 'בוסטון', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'LAS', name: 'Las Vegas McCarran', nameHe: 'לאס וגאס', city: 'Las Vegas', cityHe: 'לאס וגאס', country: 'USA', countryHe: 'ארה"ב' },
  { iata: 'ATL', name: 'Atlanta Hartsfield', nameHe: 'אטלנטה', city: 'Atlanta', cityHe: 'אטלנטה', country: 'USA', countryHe: 'ארה"ב' },

  // ====== Asia ======
  { iata: 'BKK', name: 'Bangkok Suvarnabhumi', nameHe: 'בנגקוק סוברנבומי', city: 'Bangkok', cityHe: 'בנגקוק', country: 'Thailand', countryHe: 'תאילנד' },
  { iata: 'HKT', name: 'Phuket Airport', nameHe: 'נמל התעופה פוקט', city: 'Phuket', cityHe: 'פוקט', country: 'Thailand', countryHe: 'תאילנד' },
  { iata: 'SIN', name: 'Singapore Changi', nameHe: 'סינגפור צ׳אנגי', city: 'Singapore', cityHe: 'סינגפור', country: 'Singapore', countryHe: 'סינגפור' },
  { iata: 'HKG', name: 'Hong Kong International', nameHe: 'הונג קונג', city: 'Hong Kong', cityHe: 'הונג קונג', country: 'Hong Kong', countryHe: 'הונג קונג' },
  { iata: 'NRT', name: 'Tokyo Narita', nameHe: 'טוקיו נריטה', city: 'Tokyo', cityHe: 'טוקיו', country: 'Japan', countryHe: 'יפן' },
  { iata: 'ICN', name: 'Seoul Incheon', nameHe: 'סיאול אינצ׳ון', city: 'Seoul', cityHe: 'סיאול', country: 'South Korea', countryHe: 'דרום קוריאה' },
  { iata: 'DEL', name: 'Delhi Indira Gandhi', nameHe: 'דלהי אינדירה גנדי', city: 'New Delhi', cityHe: 'ניו דלהי', country: 'India', countryHe: 'הודו' },
  { iata: 'BOM', name: 'Mumbai Airport', nameHe: 'נמל התעופה מומבאי', city: 'Mumbai', cityHe: 'מומבאי', country: 'India', countryHe: 'הודו' },
  { iata: 'MLE', name: 'Male Airport', nameHe: 'נמל התעופה מאלה', city: 'Male', cityHe: 'מאלה', country: 'Maldives', countryHe: 'מלדיביים' },
  { iata: 'CMB', name: 'Colombo Bandaranaike', nameHe: 'קולומבו', city: 'Colombo', cityHe: 'קולומבו', country: 'Sri Lanka', countryHe: 'סרי לנקה' },
  { iata: 'PEK', name: 'Beijing Capital', nameHe: 'בייג׳ינג', city: 'Beijing', cityHe: 'בייג׳ינג', country: 'China', countryHe: 'סין' },

  // ====== Africa ======
  { iata: 'JNB', name: 'Johannesburg O.R. Tambo', nameHe: 'יוהנסבורג', city: 'Johannesburg', cityHe: 'יוהנסבורג', country: 'South Africa', countryHe: 'דרום אפריקה' },
  { iata: 'CPT', name: 'Cape Town International', nameHe: 'קייפ טאון', city: 'Cape Town', cityHe: 'קייפ טאון', country: 'South Africa', countryHe: 'דרום אפריקה' },
  { iata: 'NBO', name: 'Nairobi Jomo Kenyatta', nameHe: 'ניירובי', city: 'Nairobi', cityHe: 'ניירובי', country: 'Kenya', countryHe: 'קניה' },
  { iata: 'ZNZ', name: 'Zanzibar Airport', nameHe: 'נמל התעופה זנזיבר', city: 'Zanzibar', cityHe: 'זנזיבר', country: 'Tanzania', countryHe: 'טנזניה' },
  { iata: 'ADD', name: 'Addis Ababa Bole', nameHe: 'אדיס אבבה', city: 'Addis Ababa', cityHe: 'אדיס אבבה', country: 'Ethiopia', countryHe: 'אתיופיה' },

  // ====== Caribbean & Latin America ======
  { iata: 'CUN', name: 'Cancun International', nameHe: 'קנקון', city: 'Cancun', cityHe: 'קנקון', country: 'Mexico', countryHe: 'מקסיקו' },
  { iata: 'GRU', name: 'Sao Paulo Guarulhos', nameHe: 'סאו פאולו', city: 'Sao Paulo', cityHe: 'סאו פאולו', country: 'Brazil', countryHe: 'ברזיל' },
  { iata: 'EZE', name: 'Buenos Aires Ezeiza', nameHe: 'בואנוס איירס', city: 'Buenos Aires', cityHe: 'בואנוס איירס', country: 'Argentina', countryHe: 'ארגנטינה' },
  { iata: 'BOG', name: 'Bogota El Dorado', nameHe: 'בוגוטה', city: 'Bogota', cityHe: 'בוגוטה', country: 'Colombia', countryHe: 'קולומביה' },

  // ====== Georgia / Armenia ======
  { iata: 'TBS', name: 'Tbilisi Airport', nameHe: 'נמל התעופה טביליסי', city: 'Tbilisi', cityHe: 'טביליסי', country: 'Georgia', countryHe: 'גאורגיה' },
  { iata: 'BUS', name: 'Batumi Airport', nameHe: 'נמל התעופה בטומי', city: 'Batumi', cityHe: 'בטומי', country: 'Georgia', countryHe: 'גאורגיה' },
  { iata: 'EVN', name: 'Yerevan Zvartnots', nameHe: 'ירוואן', city: 'Yerevan', cityHe: 'ירוואן', country: 'Armenia', countryHe: 'ארמניה' },

  // ====== Malta ======
  { iata: 'MLA', name: 'Malta International', nameHe: 'נמל התעופה מלטה', city: 'Valletta', cityHe: 'ולטה', country: 'Malta', countryHe: 'מלטה' },

  // ====== Ireland ======
  { iata: 'DUB', name: 'Dublin Airport', nameHe: 'נמל התעופה דבלין', city: 'Dublin', cityHe: 'דבלין', country: 'Ireland', countryHe: 'אירלנד' },

  // ====== Australia ======
  { iata: 'SYD', name: 'Sydney Kingsford Smith', nameHe: 'סידני', city: 'Sydney', cityHe: 'סידני', country: 'Australia', countryHe: 'אוסטרליה' },
  { iata: 'MEL', name: 'Melbourne Tullamarine', nameHe: 'מלבורן', city: 'Melbourne', cityHe: 'מלבורן', country: 'Australia', countryHe: 'אוסטרליה' },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();

  return airports
    .filter(a =>
      a.iata.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.nameHe.includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.cityHe.includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.countryHe.includes(q)
    )
    .slice(0, 8);
}

export default airports;
