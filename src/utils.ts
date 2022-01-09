import {
  USE_EVENT_KEY_ARRAY,
  META,
  CONTROL,
  CTRL,
  ORDERED_KEYS_SEPARATOR,
  UNORDERED_KEYS_SEPARATOR,
} from './constants';
import { Keys, KeysMapToEventHandler, Func, ScopeMapToShortcut, EventHandler } from './types.d';

/**
 * use e.code as event key except those from USE_EVENT_KEY_ARRAY
 */
const getEventKey = (e: KeyboardEvent): string => {
  return USE_EVENT_KEY_ARRAY.includes(e.key) ? e.key : e.code;
};

/**
 * serialize list of keys to string as key of the map
 * 1) sort the keys 2) handle cmd/ctrl based on isMac
 */
const serializeShortcutKeys = (isMac: boolean, keys: Keys, unOrdered = false): string => {
  const copy = [...keys];
  // handle cmd/control
  const metaOrControl = isMac ? META : CONTROL;
  const indexOfCtrl = keys.indexOf(CTRL);
  if (indexOfCtrl !== -1) copy.splice(indexOfCtrl, 1, metaOrControl);

  if (unOrdered) copy.sort(); // if unOrdered sort the keys
  return unOrdered ? copy.join(UNORDERED_KEYS_SEPARATOR) : copy.join(ORDERED_KEYS_SEPARATOR);
};

const registerKeys = (
  serializedKeys: string,
  keysMapToEventHandler: KeysMapToEventHandler,
  eventHandler: Func,
  once: boolean = false,
) => {
  if (!keysMapToEventHandler.has(serializedKeys)) {
    // init the map
    keysMapToEventHandler.set(serializedKeys, []);
  }
  // get the event listener
  const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
  if (!eventHandlerArray) return;

  const eventHandlerExists = eventHandlerArray.find((_) => _.func === eventHandler);
  if (!eventHandlerExists) {
    // insert
    eventHandlerArray.push({
      func: eventHandler,
      once,
    });
  }
};

const deregisterKeys = (serializedKeys: string, keysMapToEventHandler: KeysMapToEventHandler, eventHandler: Func) => {
  // get the event listener
  const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
  if (!eventHandlerArray) return;

  const eventHandlerIndex = eventHandlerArray.findIndex((_) => _.func === eventHandler);
  if (eventHandlerIndex !== -1) {
    // remove
    eventHandlerArray.splice(eventHandlerIndex, 1);
  }

  if (!eventHandlerArray.length) keysMapToEventHandler.delete(serializedKeys);
};

const emitShortcut = (
  scopeMapToShortcut: ScopeMapToShortcut,
  scope: string,
  serializedKeys: string,
  e: KeyboardEvent,
  blockedEventHandlers: Set<EventHandler>,
) => {
  const keysMapToEventHandler: KeysMapToEventHandler | undefined = scopeMapToShortcut.get(scope);
  if (!keysMapToEventHandler) return;

  if (keysMapToEventHandler.has(serializedKeys)) {
    const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
    if (!eventHandlerArray) return;

    eventHandlerArray.forEach((eventHandler) => {
      if (blockedEventHandlers.has(eventHandler)) return;
      eventHandler.func(e);
      if (eventHandler.once) blockedEventHandlers.add(eventHandler);
    });
  }
};

export { getEventKey, serializeShortcutKeys, registerKeys, deregisterKeys, emitShortcut };
