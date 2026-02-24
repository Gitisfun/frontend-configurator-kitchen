/** Configurator picker keys (used for panel open state and click handlers) */
export const PICKER_KEY_PLINTH = 'plinth';
export const PICKER_KEY_FRONT = 'front';
export const PICKER_KEY_SIDE_PANEL = 'sidePanel';
export const PICKER_KEY_HANDLE = 'handle';

export const CONFIGURATOR_PICKER_KEYS = [PICKER_KEY_FRONT, PICKER_KEY_SIDE_PANEL, PICKER_KEY_PLINTH, PICKER_KEY_HANDLE] as const;

export type ConfiguratorPickerKey = (typeof CONFIGURATOR_PICKER_KEYS)[number];

/** Configurator picker labels (display text in the UI) */
export const PICKER_LABEL_PLINTH = 'Plinth Color';
export const PICKER_LABEL_FRONT = 'Front Color';
export const PICKER_LABEL_SIDE_PANEL = 'Side Panel';
export const PICKER_LABEL_HANDLE = 'Handle Type';
