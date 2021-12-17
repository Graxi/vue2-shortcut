const CTRL = 'ctrl'; // a virtual key to handle control
const INPUT_TAG_NAME = 'INPUT';

const SCOPE_DATA_ATTRIBUTE = 'vshortcutscope';
const GLOBAL_SCOPE = 'GLOBAL_SCOPE';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') > -1;

/**
 * serialize list of keys to string as key of the map
 * 1) sort the keys 2) handle cmd/ctrl based on isMac
 */
const serailizeShortcutKeys = keys => {
  const copy = [...keys];
  // handle cmd/control
  const metaOrControl = isMac ? 'meta' : 'control';
  const indexOfCtrl = keys.indexOf(CTRL);
  if (indexOfCtrl !== -1) copy.splice(indexOfCtrl, 1, metaOrControl);
  // sort the keys
  copy.sort();
  return copy.join('');
};

const registerKeyGroup = (registeredKeys, keyGroup, keysMapToEventHandler, eventHandler) => {
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
    if (eventHandlerArray.indexOf(eventHandler) == -1) {
      // insert
      eventHandlerArray.push(eventHandler);
    }
  }
};

const emitShortcut = (scopeMapToShortcut, scope, serializedKeys, e) => {
  const keysMapToEventHandler = scopeMapToShortcut.get(scope);
  if (keysMapToEventHandler.has(serializedKeys)) {
    const eventHandlerArray = keysMapToEventHandler.get(serializedKeys);
    eventHandlerArray.forEach((eventHandler) => eventHandler(e));
  }
};

export default {
  install(Vue) {
    const setOfScope = new Set();
    setOfScope.add(GLOBAL_SCOPE);

    const scopeMapToShortcut = new Map();
    scopeMapToShortcut.set(GLOBAL_SCOPE, new Map());

    const registeredKeys = new Set();

    let activeScope = undefined;
    // register event listener for click
    window.addEventListener('click', e => {
      const $target = e.target;
      const $scopeTarget = $target.closest(`[data-${SCOPE_DATA_ATTRIBUTE}]`);
      if (!$scopeTarget) {
        activeScope = undefined;
      } else {
        const scope = $scopeTarget.dataset[SCOPE_DATA_ATTRIBUTE];
        if (activeScope !== scope) activeScope = scope;
      }
    });

    // handle keydown event
    // prevent shortcut getting fired in input field
    const keys = new Set();

    window.addEventListener('keydown', e => {
      const $target = e.target;
      if ($target.tagName === INPUT_TAG_NAME) return;
      keys.add(e.key.toLowerCase());
      // should execute once
      const serializedKeys = serailizeShortcutKeys(Array.from(keys));
      if (registeredKeys.has(serializedKeys)) {
        e.preventDefault();
        // emit activeScope events
        if (activeScope) emitShortcut(scopeMapToShortcut, activeScope, serializedKeys, e);
        // emit global scope events
        emitShortcut(scopeMapToShortcut, GLOBAL_SCOPE, serializedKeys, e);
      }
    });

    window.addEventListener('keyup', e => {
      const $target = e.target;
      if ($target.tagName === INPUT_TAG_NAME) return;
      const lowerCased = e.key.toLowerCase();
      if (keys.has(lowerCased)) {
        keys.delete(lowerCased);
        // when holding Meta key, releasing other keys would not fire keyup
        if (lowerCased === 'meta' && keys.size) keys.clear();
      }
    });

    // define two directives: shortcut scope and shotcut
    Vue.directive('shortcut-scope', {
      bind: (el, binding) => {
        setOfScope.add(binding.value);
        scopeMapToShortcut.set(binding.value, new Map());
        el.setAttribute(`data-${SCOPE_DATA_ATTRIBUTE}`, binding.value);
      },
    });

    // create a global method to register shortcuts
    Vue.createShortcut = params => {
      console.log('setOfScope', setOfScope);
      const { scope, keyGroup, eventHandler } = params;
      if (!scope) {
        // register globally
        registerKeyGroup(registeredKeys, keyGroup, scopeMapToShortcut.get(GLOBAL_SCOPE), eventHandler);
      } else {
        // loop scope and register on each scope
        for (const s of scope) {
          if (!setOfScope.has(s)) {
            console.error(`scope: ${s} is not registered as a shortcut-scope`);
            continue;
          }
          registerKeyGroup(registeredKeys, keyGroup, scopeMapToShortcut.get(s), eventHandler);
        }
      }
    };
  },
};
