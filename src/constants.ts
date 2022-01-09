const CTRL = 'Ctrl'; // a virtual key to handle control
const META = 'Meta';
const CONTROL = 'Control';
const MAC = 'MAC';

const ORDERED_KEYS_SEPARATOR = ',';
const UNORDERED_KEYS_SEPARATOR = '+';

const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

// mostly we use event.code but for some keys we use event.key like Control
const USE_EVENT_KEY_ARRAY = Object.freeze(['Control', 'Alt', 'Meta', 'Shift']);

export {
  CTRL,
  META,
  CONTROL,
  MAC,
  SCOPE_DATA_ATTRIBUTE,
  GLOBAL_SCOPE,
  USE_EVENT_KEY_ARRAY,
  ORDERED_KEYS_SEPARATOR,
  UNORDERED_KEYS_SEPARATOR,
};
