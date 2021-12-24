type KeysMapToEventHandler = Map<string, Function[]>;

type ScopeMapToShortcut = Map<string, KeysMapToEventHandler>;

type Keys = string[]; // multiple keys may serve the same function

export type CreateShortcutParams = {
  scope?: string[]; // no scope means global
  keyGroup: Keys[];
  eventHandler: Function;
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

const registerKeyGroup = (registeredKeys: Set<string>, keyGroup: Keys[], keysMapToEventHandler: KeysMapToEventHandler, eventHandler: Function) => {
  // keys: string[]
  for (const keys of keyGroup) {
    const serializedKeys = serailizeShortcutKeys(keys);
    registeredKeys.add(serializedKeys);

    if (!keysMapToEventHandler.has(serializedKeys)) {
      // init the map
      keysMapToEventHandler.set(serializedKeys, []);
    }
    // get the event listener
    const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
    if (!eventHandlerArray) return;

    if (eventHandlerArray.indexOf(eventHandler) == -1) {
      // insert
      eventHandlerArray.push(eventHandler);
    }
  }
};

const emitShortcut = (scopeMapToShortcut: ScopeMapToShortcut, scope: string, serializedKeys: string, e: KeyboardEvent) => {
  const keysMapToEventHandler: KeysMapToEventHandler | undefined = scopeMapToShortcut.get(scope);
  if (!keysMapToEventHandler) return;

  if (keysMapToEventHandler.has(serializedKeys)) {
    const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
    if (!eventHandlerArray) return;

    eventHandlerArray.forEach((eventHandler) => eventHandler(e));
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

    const registeredKeys: Set<string> = new Set();

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

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;
      keys.add(e.key.toLowerCase());
      const serializedKeys = serailizeShortcutKeys(Array.from(keys));
      if (registeredKeys.has(serializedKeys)) {
        e.preventDefault();
        // emit activeScope events
        if (activeScope) emitShortcut(scopeMapToShortcut, activeScope, serializedKeys, e);
        // emit global scope events
        emitShortcut(scopeMapToShortcut, GLOBAL_SCOPE, serializedKeys, e);
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const $target = e.target as HTMLElement;
      if (excludeTags && excludeTags.includes($target.tagName.toLowerCase())) return;
      if (preventWhen && preventWhen(e)) return;
      const lowerCased = e.key.toLowerCase();
      if (keys.has(lowerCased)) {
        keys.delete(lowerCased);
        // when holding Meta key, releasing other keys would not fire keyup
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
    Vue.createShortcuts = (shortcuts: CreateShortcutParams[]) => {
      shortcuts.forEach((shortcut: CreateShortcutParams) => {
        const { scope, keyGroup, eventHandler } = shortcut;
        if (!scope) {
          // register globally
          const globalScopeMapToShortcuts = scopeMapToShortcut.get(GLOBAL_SCOPE);
          if (!globalScopeMapToShortcuts) return;

          registerKeyGroup(registeredKeys, keyGroup, globalScopeMapToShortcuts, eventHandler);
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

            registerKeyGroup(registeredKeys, keyGroup, scopeMapToShortcuts, eventHandler);
          }
        }
      })
    };

    Vue.test = (template: any) => {
      template.$watch(() => {
        return this._isBeingDestroyed;
      }, (next, prev) => {
      })
    }
  },
};
