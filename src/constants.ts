const CTRL = 'Ctrl'; // a virtual key to handle control
const META = 'Meta';
const CONTROL = 'Control';
const MAC = 'MAC';

const ORDERED_KEYS_SEPARATOR = ',';
const UNORDERED_KEYS_SEPARATOR = '+';

const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

// mostly we use event.code but for some keys we use event.key like Control
const USE_EVENT_KEY_MAP_MAC: ReadonlyMap<string, string> = new Map([
  ['ShiftLeft', 'Shift'],
  ['ShiftRight', 'Shift'],
  ['AltLeft', 'Alt'],
  ['AltRight', 'Alt'],
  ['MetaLeft', META],
  ['MetaRight', META],
]);

const USE_EVENT_KEY_MAP_WINDOWS: ReadonlyMap<string, string> = new Map([
  ['ShiftLeft', 'Shift'],
  ['ShiftRight', 'Shift'],
  ['AltLeft', 'Alt'],
  ['AltRight', 'Alt'],
  ['ControlLeft', CONTROL],
  ['ControlRight', CONTROL],
]);

export {
  CTRL,
  META,
  CONTROL,
  MAC,
  SCOPE_DATA_ATTRIBUTE,
  GLOBAL_SCOPE,
  USE_EVENT_KEY_MAP_MAC,
  USE_EVENT_KEY_MAP_WINDOWS,
  ORDERED_KEYS_SEPARATOR,
  UNORDERED_KEYS_SEPARATOR,
};
