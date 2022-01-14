import { META, SCOPE_DATA_ATTRIBUTE, GLOBAL_SCOPE, MAC, KEY_MAPPING } from './constants';
import { Options, ScopeMapToShortcuts, EventHandler, CreateShortcutParams, ShortcutsList, Keys } from './types.d';
import { getCurrentScope, replaceCtrlInKeys, serializeShortcutKeys, emitShortcut, addOrRemoveShortcuts } from './utils';

const isMac = navigator.platform.toUpperCase().indexOf(MAC) > -1;

export default {
  install(Vue: any, options: Options) {
    const excludeTags = options && options.excludeTags;
    const preventWhen = options && options.preventWhen;

    const scopeMapToShortcuts: ScopeMapToShortcuts = new Map();
    scopeMapToShortcuts.set(GLOBAL_SCOPE, new Map());

    const keysMapping: Map<string, Keys> = new Map(); // serializedKeys map to original keys

    let activeScope: string | undefined;

    window.addEventListener('click', (e: MouseEvent) => {
      const currentScope = getCurrentScope(e);
      if (activeScope !== currentScope) activeScope = currentScope;
    });

    // handle keydown event
    const pressedKeys: Set<string> = new Set();

    // used for eventHandler only executed once
    const blockedEventHandlers: Set<EventHandler> = new Set();

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;

      const eventKey = KEY_MAPPING.get(e.code);
      if (!eventKey) return;

      // reset blockedEventHandlers when keys are changed
      if (!pressedKeys.has(eventKey)) blockedEventHandlers.clear();

      pressedKeys.add(eventKey);

      const transformedKeys = replaceCtrlInKeys(isMac, Array.from(pressedKeys));
      const serializedKeysArray = [ serializeShortcutKeys(transformedKeys, true) ];
      // for multiple keys
      if (transformedKeys.length > 1) {
        serializedKeysArray.push(serializeShortcutKeys(transformedKeys, false));
      }

      serializedKeysArray.forEach((serializedKeys: string) => {
        if (keysMapping.has(serializedKeys)) {
          e.preventDefault();
          // emit activeScope events
          if (activeScope) emitShortcut(scopeMapToShortcuts, activeScope, serializedKeys, e, blockedEventHandlers);
          // emit global scope events
          emitShortcut(scopeMapToShortcuts, GLOBAL_SCOPE, serializedKeys, e, blockedEventHandlers);
        }
      });
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;

      const eventKey = KEY_MAPPING.get(e.code);
      if (!eventKey) return;

      if (pressedKeys.has(eventKey)) {
        pressedKeys.delete(eventKey);
        // when holding Meta key, releasing other keys would not fire keyup until you release Meta key
        if (eventKey === META && pressedKeys.size) pressedKeys.clear();
      }
    });

    Vue.directive('shortcut-scope', {
      bind: (el: HTMLElement, binding: { value: string }) => {
        scopeMapToShortcuts.set(binding.value, new Map());
        el.setAttribute(`data-${SCOPE_DATA_ATTRIBUTE}`, binding.value);
      },
    });

    Vue.createShortcuts = (component: any, shortcuts: CreateShortcutParams[]) => {
      const context = {
        isMac,
        scopeMapToShortcuts,
        keysMapping,
      };

      let _isBeingDestroyed = false;

      Object.defineProperty(component, '_isBeingDestroyed', {
        get() {
          return _isBeingDestroyed;
        },
        set(newVal) {
          _isBeingDestroyed = newVal;
          addOrRemoveShortcuts(shortcuts, true, context);
        },
      });

      addOrRemoveShortcuts(shortcuts, false, context);
    };

    // get all shortcuts
    Vue.getAvailableShortcuts = (): ShortcutsList => {
      const shortcuts: ShortcutsList = {};

      for (const [scope, shortcutsForScope] of scopeMapToShortcuts) {
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

    // get current active scope
    Vue.$activeScope = (): string | undefined => {
      return activeScope;
    }
  },
};
