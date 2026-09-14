import React, { createContext, useContext, useEffect, useState } from 'react';

export type PaletteId =
  | 'luxury-atelier'
  | 'pink-plum'
  | 'jade-mist'
  | 'maroon-forest'
  | 'burgundy-lavender'
  | 'sage-plum'
  | 'editorial'
  | 'plum-cream'
  | 'deep-olive-mauve'
  | 'midnight'
  | 'emerald'
  | 'monochrome';

export type ThemeMode = 'light' | 'dark';

export type FontPreset =
  | 'space-grotesk'
  | 'playfair'
  | 'jakarta'
  | 'dm-sans'
  | 'cinzel'
  | 'syne'
  | 'jetbrains';

export interface FontOption {
  id: FontPreset;
  name: string;
  category: string;
  headlineFont: string;
  bodyFont: string;
  tag: string;
  description: string;
  previewClass: string;
}

export const AVAILABLE_FONT_PRESETS: FontOption[] = [
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    category: 'Modern Tech & Studio',
    headlineFont: 'Space Grotesk',
    bodyFont: 'DM Sans',
    tag: 'Editorial Sans',
    description: 'Crisp geometric clarity paired with humanist DM Sans body, ideal for futuristic productions',
    previewClass: 'font-space-grotesk',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Classic Film & Editorial Serif',
    headlineFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    tag: 'Classic Serif',
    description: 'High-contrast editorial serif paired with Plus Jakarta Sans body, evoking timeless cinema',
    previewClass: 'font-playfair',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    category: 'Contemporary Clean Geometric',
    headlineFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    tag: 'Pure Sans',
    description: 'Balanced, modern neo-grotesque sans across all headings and interfaces for sleek legibility',
    previewClass: 'font-jakarta',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Humanist Digital Grotesque',
    headlineFont: 'DM Sans',
    bodyFont: 'DM Sans',
    tag: 'Humanist',
    description: 'Approachable, warm, and highly functional geometric sans for modern creative studios',
    previewClass: 'font-dm-sans',
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    category: 'Cinematic Screenplay & Titles',
    headlineFont: 'Cinzel',
    bodyFont: 'Plus Jakarta Sans',
    tag: 'Screenplay Title',
    description: 'Classical proportions derived from first-century Latin inscriptions, crafted for marquee films',
    previewClass: 'font-cinzel',
  },
  {
    id: 'syne',
    name: 'Syne',
    category: 'Avant-Garde & Art Direction',
    headlineFont: 'Syne',
    bodyFont: 'DM Sans',
    tag: 'Avant-Garde',
    description: 'Expressive, bold typographic forms tailored for high-fashion, experimental arts, and indie reels',
    previewClass: 'font-syne',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    category: 'Technical Director & Call-Sheet',
    headlineFont: 'JetBrains Mono',
    bodyFont: 'DM Sans',
    tag: 'Studio Code',
    description: 'Monospaced precision for technical camera logs, ACES specifications, and call-sheet timings',
    previewClass: 'font-jetbrains',
  },
];

export interface PaletteOption {
  id: PaletteId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  secondaryAccentColor: string;
  swatches: [string, string, string, string, string];
  lightPreview: {
    bg: string;
    card: string;
    accent: string;
    secondary: string;
    text: string;
  };
  darkPreview: {
    bg: string;
    card: string;
    accent: string;
    secondary: string;
    text: string;
  };
}

export const AVAILABLE_PALETTES: PaletteOption[] = [
  {
    id: 'luxury-atelier',
    name: 'Maison Lumière',
    tagline: 'Champagne Gold & Obsidian Marble',
    description: 'Bespoke architectural cinema salon with warm cove lighting, champagne gold accents, and deep obsidian espresso marble',
    accentColor: '#E5C38C',
    secondaryAccentColor: '#C99E5C',
    swatches: ['#090605', '#1C140F', '#E5C38C', '#C99E5C', '#FAF5EE'],
    lightPreview: {
      bg: '#FAF6F0',
      card: '#FFFFFF',
      accent: '#C99E5C',
      secondary: '#E5C38C',
      text: '#17110C',
    },
    darkPreview: {
      bg: '#090605',
      card: '#140E0A',
      accent: '#E5C38C',
      secondary: '#C99E5C',
      text: '#FAF5EE',
    },
  },
  {
    id: 'pink-plum',
    name: 'Pink Plum',
    tagline: 'Soft Pink & Velvet Plum',
    description: 'Clean modern editorial contrast with Space Grotesk typography, soft candy pink, and deep plum accents',
    accentColor: '#FFAED7',
    secondaryAccentColor: '#66234A',
    swatches: ['#FFFFFF', '#E2E8F0', '#FFAED7', '#66234A', '#2F001D'],
    lightPreview: {
      bg: '#FFFFFF',
      card: '#FFFFFF',
      accent: '#FFAED7',
      secondary: '#66234A',
      text: '#2F001D',
    },
    darkPreview: {
      bg: '#160410',
      card: '#25071B',
      accent: '#FFAED7',
      secondary: '#F472B6',
      text: '#FFF0F7',
    },
  },
  {
    id: 'jade-mist',
    name: 'Jade Mist',
    tagline: 'Bright Snow & Neon Jade',
    description: 'Bright snow canvas with slate grey typography and deliberate electric jade green accents for creative focus',
    accentColor: '#0CCA4A',
    secondaryAccentColor: '#6E8387',
    swatches: ['#FCFAFA', '#C8D3D5', '#A4B8C4', '#6E8387', '#0CCA4A'],
    lightPreview: {
      bg: '#FCFAFA',
      card: '#FFFFFF',
      accent: '#0CCA4A',
      secondary: '#6E8387',
      text: '#1B2528',
    },
    darkPreview: {
      bg: '#0F1618',
      card: '#162023',
      accent: '#0CCA4A',
      secondary: '#A4B8C4',
      text: '#FCFAFA',
    },
  },
  {
    id: 'maroon-forest',
    name: 'Maroon Forest',
    tagline: 'Deep Maroon & Dark Forest',
    description: 'Editorial contrast with dusty rosewood borders, deep maroon-black typography, and very dark forest green accents',
    accentColor: '#002500',
    secondaryAccentColor: '#BF8B85',
    swatches: ['#FFFFFF', '#BF8B85', '#4E040E', '#2C414E', '#002500'],
    lightPreview: {
      bg: '#FFFFFF',
      card: '#FFFFFF',
      accent: '#002500',
      secondary: '#BF8B85',
      text: '#4E040E',
    },
    darkPreview: {
      bg: '#120A0B',
      card: '#1D1213',
      accent: '#BF8B85',
      secondary: '#002500',
      text: '#FFFFFF',
    },
  },
  {
    id: 'burgundy-lavender',
    name: 'Burgundy Lavender',
    tagline: 'Near Black & Pale Lavender',
    description: 'Dark editorial character layered with deep burgundy, slate grey, and luminous pale lavender and creamy white accents',
    accentColor: '#4B0B06',
    secondaryAccentColor: '#E7E6F7',
    swatches: ['#0A0A0A', '#626C66', '#4B0B06', '#E7E6F7', '#FFF8F0'],
    lightPreview: {
      bg: '#FFF8F0',
      card: '#FFFFFF',
      accent: '#4B0B06',
      secondary: '#626C66',
      text: '#0A0A0A',
    },
    darkPreview: {
      bg: '#0A0A0A',
      card: '#151515',
      accent: '#4B0B06',
      secondary: '#E7E6F7',
      text: '#FFF8F0',
    },
  },
  {
    id: 'sage-plum',
    name: 'Sage + Plum',
    tagline: 'Nordic Sage & Velvet Damson',
    description: 'Subtle muted herbal sage layered with refined velvet damson plum accents on calm natural neutrals',
    accentColor: '#3B695D',
    secondaryAccentColor: '#701A75',
    swatches: ['#F5F7F6', '#D2E0DC', '#3B695D', '#701A75', '#11221D'],
    lightPreview: {
      bg: '#F5F7F6',
      card: '#FFFFFF',
      accent: '#3B695D',
      secondary: '#701A75',
      text: '#11221D',
    },
    darkPreview: {
      bg: '#0C1714',
      card: '#142420',
      accent: '#4ADE80',
      secondary: '#C084FC',
      text: '#F1F7F4',
    },
  },
  {
    id: 'editorial',
    name: 'Warm Editorial',
    tagline: 'Amber & Obsidian Cinema',
    description: 'Golden hour amber highlights on warm ivory paper & deep cinema black',
    accentColor: '#E58B13',
    secondaryAccentColor: '#9A3412',
    swatches: ['#FAF5EE', '#EAE2D5', '#E58B13', '#9A3412', '#1A1715'],
    lightPreview: {
      bg: '#FAF6F0',
      card: '#FFFFFF',
      accent: '#E58B13',
      secondary: '#9A3412',
      text: '#1C1917',
    },
    darkPreview: {
      bg: '#12100E',
      card: '#1C1916',
      accent: '#F5A623',
      secondary: '#FB923C',
      text: '#FBF8F5',
    },
  },
  {
    id: 'midnight',
    name: 'Futuristic (Midnight)',
    tagline: 'Sapphire Slate & Electric Cyan',
    description: 'Glacier blue light and deep atmospheric sci-fi sapphire shadows',
    accentColor: '#00C2FF',
    secondaryAccentColor: '#6366F1',
    swatches: ['#F0F5FA', '#D6E3F0', '#0284C7', '#6366F1', '#0F172A'],
    lightPreview: {
      bg: '#F2F6FA',
      card: '#FFFFFF',
      accent: '#0099FF',
      secondary: '#6366F1',
      text: '#0D1526',
    },
    darkPreview: {
      bg: '#0A0F1D',
      card: '#121B2E',
      accent: '#00D2FF',
      secondary: '#818CF8',
      text: '#F0F6FC',
    },
  },
  {
    id: 'emerald',
    name: 'Teal (Celluloid)',
    tagline: 'Deep Teal & Luminous Mint',
    description: 'Organic celluloid grain with soothing mint light and dark forest foliage',
    accentColor: '#0D9488',
    secondaryAccentColor: '#10B981',
    swatches: ['#F0F7F2', '#D3E8D8', '#059669', '#0D9488', '#062010'],
    lightPreview: {
      bg: '#F0F7F6',
      card: '#FFFFFF',
      accent: '#0D9488',
      secondary: '#059669',
      text: '#092320',
    },
    darkPreview: {
      bg: '#081413',
      card: '#112321',
      accent: '#14B8A6',
      secondary: '#34D399',
      text: '#EDFAF7',
    },
  },
  {
    id: 'monochrome',
    name: 'Grey Blue (Noir Classic)',
    tagline: 'Steel Blue & Platinum Halide',
    description: 'Crisp studio photography look with balanced steel blues and silver tones',
    accentColor: '#475569',
    secondaryAccentColor: '#94A3B8',
    swatches: ['#F4F6F9', '#CBD5E1', '#334155', '#64748B', '#111827'],
    lightPreview: {
      bg: '#F4F6F9',
      card: '#FFFFFF',
      accent: '#334155',
      secondary: '#64748B',
      text: '#111827',
    },
    darkPreview: {
      bg: '#0F141C',
      card: '#17202D',
      accent: '#94A3B8',
      secondary: '#CBD5E1',
      text: '#F8FAFC',
    },
  },
  {
    id: 'plum-cream',
    name: 'Plum + Warm Cream',
    tagline: 'Damson Velvet & Warm Alabaster',
    description: 'Sophisticated deep darkberry plum with warm vanilla cream highlights on neutral linen',
    accentColor: '#831843',
    secondaryAccentColor: '#D97706',
    swatches: ['#FAF7F8', '#E9D5DA', '#831843', '#D97706', '#220A16'],
    lightPreview: {
      bg: '#FAF7F8',
      card: '#FFFFFF',
      accent: '#831843',
      secondary: '#D97706',
      text: '#220A16',
    },
    darkPreview: {
      bg: '#160912',
      card: '#24101E',
      accent: '#F472B6',
      secondary: '#FBBF24',
      text: '#FDF2F8',
    },
  },
  {
    id: 'deep-olive-mauve',
    name: 'Deep Olive + Mauve',
    tagline: 'Tuscan Olive & Vintage Dusty Mauve',
    description: 'Earthy botanical olive tempered with subtle vintage dusty mauve over soft parchment',
    accentColor: '#3F6212',
    secondaryAccentColor: '#A21CAF',
    swatches: ['#F6F7F4', '#DEE4D5', '#3F6212', '#A21CAF', '#17200C'],
    lightPreview: {
      bg: '#F6F7F4',
      card: '#FFFFFF',
      accent: '#3F6212',
      secondary: '#A21CAF',
      text: '#17200C',
    },
    darkPreview: {
      bg: '#0F1607',
      card: '#1B260E',
      accent: '#84CC16',
      secondary: '#E879F9',
      text: '#F7FCE8',
    },
  },
];

interface ThemeContextType {
  palette: PaletteId;
  mode: ThemeMode;
  fontPreset: FontPreset;
  theme: string;
  isDark: boolean;
  setPalette: (palette: PaletteId) => void;
  setMode: (mode: ThemeMode) => void;
  setFontPreset: (preset: FontPreset) => void;
  toggleTheme: () => void;
  availablePalettes: PaletteOption[];
  availableFontPresets: FontOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PALETTE_STORAGE_KEY = 'afflatus_palette';
const MODE_STORAGE_KEY = 'afflatus_mode';
const FONT_STORAGE_KEY = 'afflatus_font_preset';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved font preset
  const [fontPreset, setFontPresetState] = useState<FontPreset>(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY) as FontPreset | null;
    if (saved && AVAILABLE_FONT_PRESETS.some((f) => f.id === saved)) {
      return saved;
    }
    return 'playfair';
  });

  // Load saved palette
  const [palette, setPaletteState] = useState<PaletteId>(() => {
    const saved = localStorage.getItem(PALETTE_STORAGE_KEY) as PaletteId | null;
    if (saved && AVAILABLE_PALETTES.some((p) => p.id === saved)) {
      return saved;
    }
    // Backward compatibility check
    const legacyTheme = localStorage.getItem('afflatus_active_theme');
    if (legacyTheme === 'midnight') return 'midnight';
    if (legacyTheme === 'emerald') return 'emerald';
    if (legacyTheme === 'monochrome') return 'monochrome';
    return 'luxury-atelier';
  });

  // Load saved mode
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    const legacyTheme = localStorage.getItem('afflatus_active_theme');
    if (legacyTheme === 'light') return 'light';
    return 'dark';
  });

  const isDark = mode === 'dark';
  const theme = `${palette}-${mode}`;

  useEffect(() => {
    const root = document.documentElement;
    // Set theme and font attributes for CSS variable matching
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-palette', palette);
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-font', fontPreset);

    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    localStorage.setItem(FONT_STORAGE_KEY, fontPreset);
  }, [palette, mode, theme, isDark, fontPreset]);

  const setPalette = (newPalette: PaletteId) => {
    setPaletteState(newPalette);
    // Burgundy Lavender has an intended dark editorial aesthetic
    if (newPalette === 'burgundy-lavender') {
      setModeState('dark');
    } else if (newPalette === 'pink-plum') {
      setModeState('light');
    }
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setFontPreset = (newFont: FontPreset) => {
    setFontPresetState(newFont);
  };

  // Toggle ONLY Light / Dark mode without changing the active palette!
  const toggleTheme = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider
      value={{
        palette,
        mode,
        fontPreset,
        theme,
        isDark,
        setPalette,
        setMode,
        setFontPreset,
        toggleTheme,
        availablePalettes: AVAILABLE_PALETTES,
        availableFontPresets: AVAILABLE_FONT_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
