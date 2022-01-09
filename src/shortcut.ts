import { META, SCOPE_DATA_ATTRIBUTE, GLOBAL_SCOPE, MAC } from './constants';
import { Options, ScopeMapToShortcut, EventHandler, CreateShortcutParams, ShortcutsList, Keys } from './types.d';
import { getEventKey, serializeShortcutKeys, registerKeys, deregisterKeys, emitShortcut } from './utils';

const isMac = navigator.platform.toUpperCase().indexOf(MAC) > -1;

export default {
  install(Vue: any, options: Options) {
    const excludeTags = options && options.excludeTags;
    const preventWhen = options && options.preventWhen;

    const setOfScope: Set<string> = new Set();
    setOfScope.add(GLOBAL_SCOPE);

    const scopeMapToShortcut: ScopeMapToShortcut = new Map();
    scopeMapToShortcut.set(GLOBAL_SCOPE, new Map());

    const keysMapping: Map<string, Keys> = new Map(); // serializedKeys map to original keys

    let activeScope: string | undefined;
    // register event listener for click
    window.addEventListener('click', (e: MouseEvent) => {
      const $target = e.target as HTMLElement;
      const $scopeTarget = $target.closest(`[data-${SCOPE_DATA_ATTRIBUTE}]`) as HTMLElement;
      if (!$scopeTarget) {
        activeScope = undefined;
      } else {
        const scope = $scopeTarget.dataset[SCOPE_DATA_ATTRIBUTE];
        if (activeScope !== scope) activeScope = scope;
      }
    });

    // handle keydown event
    const pressedKeys: Set<string> = new Set();

    // used for eventHandler only executed once
    const blockedEventHandlers: Set<EventHandler> = new Set();

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;

      const eventKey = getEventKey(e);

      // reset blockedEventHandlers when keys are changed
      if (!pressedKeys.has(eventKey)) blockedEventHandlers.clear();

      pressedKeys.add(eventKey);

      const serializedKeysArray = [
        serializeShortcutKeys(isMac, Array.from(pressedKeys), true),
        serializeShortcutKeys(isMac, Array.from(pressedKeys), false),
      ];

      serializedKeysArray.forEach((serializedKeys: string) => {
        if (keysMapping.has(serializedKeys)) {
          e.preventDefault();
          // emit activeScope events
          if (activeScope) emitShortcut(scopeMapToShortcut, activeScope, serializedKeys, e, blockedEventHandlers);
          // emit global scope events
          emitShortcut(scopeMapToShortcut, GLOBAL_SCOPE, serializedKeys, e, blockedEventHandlers);
        }
      });
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;

      const eventKey = getEventKey(e);

      if (pressedKeys.has(eventKey)) {
        pressedKeys.delete(eventKey);
        // when holding Meta key, releasing other keys would not fire keyup until you release Meta key
        if (eventKey === META && pressedKeys.size) pressedKeys.clear();
      }
    });

    // define two directives: shortcut scope and shotcut
    Vue.directive('shortcut-scope', {
      bind: (el: HTMLElement, binding: { value: string }) => {
        setOfScope.add(binding.value);
        scopeMapToShortcut.set(binding.value, new Map());
        el.setAttribute(`data-${SCOPE_DATA_ATTRIBUTE}`, binding.value);
      },
    });

    // create a global method to register shortcuts
    Vue.createShortcuts = (component: any, shortcuts: CreateShortcutParams[]) => {
      let _isBeingDestroyed = false;

      Object.defineProperty(component, '_isBeingDestroyed', {
        get() {
          return _isBeingDestroyed;
        },
        set(newVal) {
          _isBeingDestroyed = newVal;
          // unregister events
          addOrRemoveShortcuts(shortcuts, true);
        },
      });

      addOrRemoveShortcuts(shortcuts, false);
    };

    const addOrRemoveShortcuts = (shortcuts: CreateShortcutParams[], remove: boolean) => {
      shortcuts.forEach((shortcut: CreateShortcutParams) => {
        const { scope, keys, eventHandler, once, unOrdered } = shortcut;

        // serialize keys
        const serializedKeys = serializeShortcutKeys(isMac, keys, unOrdered);
        if (!scope) {
          const globalScopeMapToShortcuts = scopeMapToShortcut.get(GLOBAL_SCOPE);
          if (!globalScopeMapToShortcuts) return;

          if (remove) {
            deregisterKeys(serializedKeys, globalScopeMapToShortcuts, eventHandler);
            // check if should delete keys from keysMapping
            const eventHandlerArray = globalScopeMapToShortcuts.get(serializedKeys);
            if (!eventHandlerArray) keysMapping.delete(serializedKeys);
          } else {
            keysMapping.set(serializedKeys, keys);
            registerKeys(serializedKeys, globalScopeMapToShortcuts, eventHandler, once);
          }
        } else {
          if (!Array.isArray(scope)) {
            console.error('Scope must be an array');
            return;
          }
          // loop scope and register/deregister on each scope
          for (const s of scope) {
            if (!setOfScope.has(s)) {
              console.error(`scope: ${s} is not registered as a shortcut-scope`);
              continue;
            }
            const scopeMapToShortcuts = scopeMapToShortcut.get(s);
            if (!scopeMapToShortcuts) return;

            if (remove) {
              // keysMapping.delete(serializedKeys); // IN DOUBT: there might be same keys registered in other component
              deregisterKeys(serializedKeys, scopeMapToShortcuts, eventHandler);
              // check if should delete keys from keysMapping
              const eventHandlerArray = scopeMapToShortcuts.get(serializedKeys);
              if (!eventHandlerArray) keysMapping.delete(serializedKeys);
            } else {
              keysMapping.set(serializedKeys, keys);
              registerKeys(serializedKeys, scopeMapToShortcuts, eventHandler, once);
            }
          }
        }
      });
    };

    // get all shortcuts
    Vue.getAvailableShortcuts = (): ShortcutsList => {
      const shortcuts: ShortcutsList = {};

      for (const [scope, shortcutsForScope] of scopeMapToShortcut) {
        shortcuts[scope] = [];
        for (const serializedKeys of shortcutsForScope.keys()) {
          const originalKeys: Keys | undefined = keysMapping.get(serializedKeys);
          if (originalKeys) {
            shortcuts[scope].push({
              keys: originalKeys,
            });
          }
        }
      }

      return shortcuts;
    };
  },
};
