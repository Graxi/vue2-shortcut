import {
  META,
  CONTROL,
  CTRL,
  ORDERED_KEYS_SEPARATOR,
  UNORDERED_KEYS_SEPARATOR,
  GLOBAL_SCOPE,
  SCOPE_DATA_ATTRIBUTE,
} from './constants';
import {
  Keys,
  KeysMapToEventHandler,
  Func,
  ScopeMapToShortcuts,
  EventHandler,
  CreateShortcutParams,
  KeysMapping,
} from './types.d';

/**
 * get current scope determined by mouse down event
 */
const getCurrentScope = (e: MouseEvent): undefined | string => {
  const $target = e.target as HTMLElement;
  const $scopeTarget = $target.closest(`[data-${SCOPE_DATA_ATTRIBUTE}]`) as HTMLElement;
  if (!$scopeTarget) return undefined;
  return $scopeTarget.dataset[SCOPE_DATA_ATTRIBUTE];
};

/**
 * when user uses CTRL to register a shortcut, we will replace CTRL with CONTROL or META based on navigator
 */
const replaceCtrlInKeys = (isMac: boolean, keys: Keys): Keys => {
  const copy = [...keys];
  const indexOfCtrl = copy.indexOf(CTRL);
  if (indexOfCtrl == -1) return copy;
  const metaOrControl = isMac ? META : CONTROL;
  copy.splice(indexOfCtrl, 1, metaOrControl);
  return copy;
};

/**
 * serialize list of keys to string as key of the map
 * sort keys based on unOrdered
 */
const serializeShortcutKeys = (keys: Keys, unOrdered = false): string => {
  const copy = [...keys];
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
    keysMapToEventHandler.set(serializedKeys, []);
  }

  const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
  if (!eventHandlerArray) return;

  const eventHandlerExists = eventHandlerArray.find((_) => _.func === eventHandler);
  if (!eventHandlerExists) {
    eventHandlerArray.push({
      func: eventHandler,
      once,
    });
  }
};

const deregisterKeys = (serializedKeys: string, keysMapToEventHandler: KeysMapToEventHandler, eventHandler: Func) => {
  const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
  if (!eventHandlerArray) return;

  const eventHandlerIndex = eventHandlerArray.findIndex((_) => _.func === eventHandler);
  if (eventHandlerIndex !== -1) {
    eventHandlerArray.splice(eventHandlerIndex, 1);
  }

  if (!eventHandlerArray.length) keysMapToEventHandler.delete(serializedKeys);
};

const emitShortcut = (
  scopeMapToShortcut: ScopeMapToShortcuts,
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
      if (eventHandler.once) blockedEventHandlers.add(eventHandler); // TODO: optimize by not calling emitShortcut repeatedly
    });
  }
};

const addOrRemoveShortcuts = (
  shortcuts: CreateShortcutParams[],
  remove: boolean,
  context: {
    isMac: boolean;
    scopeMapToShortcuts: ScopeMapToShortcuts;
    keysMapping: KeysMapping;
  },
) => {
  const { isMac, scopeMapToShortcuts, keysMapping } = context;
  shortcuts.forEach((shortcut: CreateShortcutParams) => {
    const { scope, keys, eventHandler, once, unOrdered, description } = shortcut;

    // serialize keys
    const transformedKeys = replaceCtrlInKeys(isMac, keys);
    const serializedKeys = serializeShortcutKeys(transformedKeys, unOrdered);
    if (!scope) {
      const globalScopeMapToShortcuts = scopeMapToShortcuts.get(GLOBAL_SCOPE);
      if (!globalScopeMapToShortcuts) return;

      if (remove) {
        deregisterKeys(serializedKeys, globalScopeMapToShortcuts, eventHandler);
        // check if should delete keys from keysMapping
        const eventHandlerArray = globalScopeMapToShortcuts.get(serializedKeys);
        if (!eventHandlerArray) keysMapping.delete(serializedKeys);
      } else {
        keysMapping.set(serializedKeys, {
          originalKeys: keys,
          description,
        });
        registerKeys(serializedKeys, globalScopeMapToShortcuts, eventHandler, once);
      }
    } else {
      if (!Array.isArray(scope)) {
        console.error('Scope must be an array');
        return;
      }
      // loop scope and register/deregister on each scope
      for (const s of scope) {
        if (!scopeMapToShortcuts.has(s)) {
          console.error(`scope: ${s} is not registered as a shortcut-scope`);
          continue;
        }
        const certainScopeMapToShortcuts = scopeMapToShortcuts.get(s);
        if (!certainScopeMapToShortcuts) return;

        if (remove) {
          deregisterKeys(serializedKeys, certainScopeMapToShortcuts, eventHandler);
          // check if should delete keys from keysMapping
          const eventHandlerArray = certainScopeMapToShortcuts.get(serializedKeys);
          if (!eventHandlerArray) keysMapping.delete(serializedKeys);
        } else {
          keysMapping.set(serializedKeys, {
            originalKeys: keys,
            description,
          });
          registerKeys(serializedKeys, certainScopeMapToShortcuts, eventHandler, once);
        }
      }
    }
  });
};

export {
  getCurrentScope,
  replaceCtrlInKeys,
  serializeShortcutKeys,
  registerKeys,
  deregisterKeys,
  emitShortcut,
  addOrRemoveShortcuts,
};
