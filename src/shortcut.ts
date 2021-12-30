type EventHandler = {
  func: Function;
  once?: boolean;
}

type KeysMapToEventHandler = Map<string, EventHandler[]>;

type ScopeMapToShortcut = Map<string, KeysMapToEventHandler>;

type Keys = string[]; // multiple keys may serve the same function

export type ShortcutsList = {
  [scope: string]: { keys: Keys }[];
}

export type CreateShortcutParams = {
  scope?: string[]; // no scope means global
  keys: Keys; // for now only consider one key combo
  eventHandler: Function;
  once?: boolean;
};

export type Options = {
  excludeTags?: string[];
  preventWhen?: CheckPreventFunction
}

const CTRL = 'ctrl'; // a virtual key to handle control

const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') > -1;

/**
 * serialize list of keys to string as key of the map
 * 1) sort the keys 2) handle cmd/ctrl based on isMac
 */
const serailizeShortcutKeys = (keys: Keys): string => {
  const copy = [...keys];
  // handle cmd/control
  const metaOrControl = isMac ? 'meta' : 'control';
  const indexOfCtrl = keys.indexOf(CTRL);
  if (indexOfCtrl !== -1) copy.splice(indexOfCtrl, 1, metaOrControl);
  // sort the keys
  copy.sort();
  return copy.join('');
};

const registerKeyGroup = (serializedKeys: string, keysMapToEventHandler: KeysMapToEventHandler, eventHandler: Function, once: boolean=false) => {
  if (!keysMapToEventHandler.has(serializedKeys)) {
    // init the map
    keysMapToEventHandler.set(serializedKeys, []);
  }
  // get the event listener
  const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
  if (!eventHandlerArray) return;

  const eventHandlerExists = eventHandlerArray.find(_ => _.func === eventHandler)
  if (!eventHandlerExists) {
    // insert
    eventHandlerArray.push({
      func: eventHandler,
      once
    });
  }
};

const emitShortcut = (scopeMapToShortcut: ScopeMapToShortcut, scope: string, serializedKeys: string, e: KeyboardEvent, blockedEventHandlers: Set<EventHandler>) => {
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

type CheckPreventFunction = (e?: KeyboardEvent) => boolean;

export default {
  install(Vue: any, options: Options) {
    const excludeTags = options && options.excludeTags;
    const preventWhen = options && options.preventWhen;

    const setOfScope: Set<string> = new Set();
    setOfScope.add(GLOBAL_SCOPE);

    const scopeMapToShortcut: ScopeMapToShortcut = new Map();
    scopeMapToShortcut.set(GLOBAL_SCOPE, new Map());

    const keysMapping: Map<string, Keys> = new Map(); // serializedKeys map to original keys

    let activeScope: string | undefined = undefined;
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
    const keys: Set<string> = new Set();

    // used for eventHandler only executed once
    const blockedEventHandlers: Set<EventHandler> = new Set();

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;
      
      // reset blockedEventHandlers when keys are changed
      if (!keys.has(e.key)) blockedEventHandlers.clear();

      keys.add(e.key.toLowerCase());
      const serializedKeys = serailizeShortcutKeys(Array.from(keys));
      if (keysMapping.has(serializedKeys)) {
        e.preventDefault();
        // emit activeScope events
        if (activeScope) emitShortcut(scopeMapToShortcut, activeScope, serializedKeys, e, blockedEventHandlers);
        // emit global scope events
        emitShortcut(scopeMapToShortcut, GLOBAL_SCOPE, serializedKeys, e, blockedEventHandlers);
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;
      const lowerCased = e.key.toLowerCase();
      if (keys.has(lowerCased)) {
        keys.delete(lowerCased);
        // when holding Meta key, releasing other keys would not fire keyup until you release Meta key
        if (lowerCased === 'meta' && keys.size) keys.clear();
      }
    });

    // define two directives: shortcut scope and shotcut
    Vue.directive('shortcut-scope', {
      bind: (el: HTMLElement, binding: {value: string}) => {
        setOfScope.add(binding.value);
        scopeMapToShortcut.set(binding.value, new Map());
        el.setAttribute(`data-${SCOPE_DATA_ATTRIBUTE}`, binding.value);
      }
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
        },
      });

      shortcuts.forEach((shortcut: CreateShortcutParams) => {
        const { scope, keys, eventHandler, once } = shortcut;
        // serialize keys
        const serializedKeys = serailizeShortcutKeys(keys);

        if (!scope) {
          // register globally
          const globalScopeMapToShortcuts = scopeMapToShortcut.get(GLOBAL_SCOPE);
          if (!globalScopeMapToShortcuts) return;

          keysMapping.set(serializedKeys, keys);          
          registerKeyGroup(serializedKeys, globalScopeMapToShortcuts, eventHandler, once);
        } else {
          if (!Array.isArray(scope)) {
            console.error('Scope must be an array');
            return;
          }

          // loop scope and register on each scope
          for (const s of scope) {
            if (!setOfScope.has(s)) {
              console.error(`scope: ${s} is not registered as a shortcut-scope`);
              continue;
            }

            const scopeMapToShortcuts = scopeMapToShortcut.get(s);
            if (!scopeMapToShortcuts) return;

            keysMapping.set(serializedKeys, keys);
            registerKeyGroup(serializedKeys, scopeMapToShortcuts, eventHandler, once);
          }
        }
      })
    };

    // get all shortcuts
    Vue.getAvailableShortcuts = (): ShortcutsList => {
      const shortcuts: ShortcutsList = {};

      for(const [scope, shortcutsForScope] of scopeMapToShortcut) {
        shortcuts[scope] = [];
        for(const serializedKeys of shortcutsForScope.keys()) {
          const originalKeys: Keys | undefined = keysMapping.get(serializedKeys);
          if (originalKeys) {
            shortcuts[scope].push({
              keys: originalKeys
            })
          }
        }
      }

      return shortcuts;
    }
  }
};
