import { ref, watch } from 'vue';

export type ThemeId =
  | 'classic'
  | 'warm-earth'
  | 'midnight'
  | 'sage'
  | 'noir'
  | 'coastal'
  | 'industrial'
  | 'zen'
  | 'bistro'
  | 'arctic';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'classic', label: 'Classic', description: 'Navy & green — timeless Dutch craftsmanship' },
  { id: 'warm-earth', label: 'Warm Earth', description: 'Tuscan farmhouse — terracotta & olive wood' },
  { id: 'sage', label: 'Sage & Stone', description: 'Scandinavian cabin — birch & morning fog' },
  { id: 'coastal', label: 'Coastal Breeze', description: 'Beach house — driftwood & ocean blue' },
  { id: 'bistro', label: 'French Bistro', description: 'Parisian patisserie — marble & burgundy' },
  { id: 'arctic', label: 'Arctic Snow', description: 'Nordic minimal — white quartz & teal' },
  { id: 'zen', label: 'Japanese Zen', description: 'Wabi-sabi — hinoki wood & indigo' },
  { id: 'industrial', label: 'Industrial Loft', description: 'Urban warehouse — concrete & Edison bulbs' },
  { id: 'midnight', label: 'Midnight Modern', description: 'Manhattan penthouse — dark & electric blue' },
  { id: 'noir', label: 'Noir & Gold', description: 'Showroom luxury — black marble & brass' },
];

const STORAGE_KEY = 'configurator-theme';

function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'classic';
  return (localStorage.getItem(STORAGE_KEY) as ThemeId) || 'classic';
}

const activeTheme = ref<ThemeId>(getStoredTheme());
let previewing = false;

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

function applyTheme(id: ThemeId) {
  if (typeof document === 'undefined') return;

  document.documentElement.classList.add('theme-transitioning');
  clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 350);

  if (id === 'classic') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
}

export function useTheme() {
  applyTheme(activeTheme.value);

  watch(activeTheme, (id) => {
    applyTheme(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, id);
    }
  });

  function setTheme(id: ThemeId) {
    previewing = false;
    activeTheme.value = id;
  }

  function previewTheme(id: ThemeId) {
    previewing = true;
    applyTheme(id);
  }

  function cancelPreview() {
    if (!previewing) return;
    previewing = false;
    applyTheme(activeTheme.value);
  }

  return {
    activeTheme,
    themes: THEMES,
    setTheme,
    previewTheme,
    cancelPreview,
  };
}
