export const CTRL = 'Ctrl'; // a virtual key to handle control
export const META = 'Meta';
export const CONTROL = 'Control';

export const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
export const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

// mostly we use event.code but for some keys we use event.key like Control
export const USE_EVENT_KEY_ARRAY = Object.freeze([
  'Control', 'Alt', 'Meta', 'Shift'
]);

