export const CTRL = 'ctrl'; // a virtual key to handle control

export const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
export const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

// when one key has two up and down keys
export const getShiftConvertKey = (key: string): string | undefined => {
  const SHIFT_CONVERT_KEYS: {[key: string] : string} = {
    '`': '~',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '"',
    ',': '<',
    '.': '>',
    '/': '?'
  }
  return SHIFT_CONVERT_KEYS[key];
}

export const SHIFT = 'shift';

