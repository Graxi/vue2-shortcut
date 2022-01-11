/**
 * @jest-environment jsdom
 */

import { getCurrentScope, replaceCtrlInKeys, serializeShortcutKeys, registerKeys, deregisterKeys, emitShortcut } from '../src/utils';
import { CTRL, META, CONTROL, UNORDERED_KEYS_SEPARATOR, ORDERED_KEYS_SEPARATOR, SCOPE_DATA_ATTRIBUTE } from '../src/constants';
import { EventHandler } from '../src/types.d';

const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
}

// getCurrentScope
describe('it should test getCurrentScope', () => {
  const SCOPE = 'a';
  document.body.innerHTML = `
    <div id='scoped' data-${SCOPE_DATA_ATTRIBUTE}=${SCOPE}></div>
    <div id='no-scope'></div>
  `;

  test('it should return undefined if clicking no-scope area', () => {
    const $noScopeArea = document.getElementById('no-scope');
    const mockEvent: any = {
      target: $noScopeArea
    };
    expect(getCurrentScope(mockEvent)).toBeUndefined();
  })

  test('it should return a if clicking scope area', () => {
    const $scopeArea = document.getElementById('scoped');
    const mockEvent: any = {
      target: $scopeArea
    };
    expect(getCurrentScope(mockEvent)).toEqual(SCOPE);
  })
})

// replaceCtrlInKeys
describe('it should test replaceCtrlInKeys()', () => {
  test('if CTRL is not included in keys, do nothing about the keys array', () => {
    const mockKeys = ['KeyA', 'KeyB'];
    const isMac = [true, false][getRandomIndex(2)];
    expect(replaceCtrlInKeys(isMac, mockKeys)).toEqual(mockKeys);
  })

  test('if CTRL is included in keys, replace it with META when isMac is true', () => {
    const mockKeys = [CTRL, 'KeyA', 'KeyB'];
    expect(replaceCtrlInKeys(true, mockKeys)).toEqual([META, 'KeyA', 'KeyB']);
  })

  test('if CTRL is included in keys, replace it with CONTROL when isMac is false', () => {
    const mockKeys = [CTRL, 'KeyA', 'KeyB'];
    expect(replaceCtrlInKeys(false, mockKeys)).toEqual([CONTROL, 'KeyA', 'KeyB']);
  })
})

// serializeShortcutKeys
describe('it should test serializeShortcutKeys()', () => {
  const mockKeys = [META, 'KeyA', 'KeyB'];

  test('if unOrdered is false, it should concatenate keys with comma', () => {
    expect(serializeShortcutKeys(mockKeys, false)).toEqual(mockKeys.join(ORDERED_KEYS_SEPARATOR));
  })

  test('if unOrdered is true, it should sort the keys and concatenate them with period', () => {
    expect(serializeShortcutKeys(mockKeys, true)).toEqual(mockKeys.sort().join(UNORDERED_KEYS_SEPARATOR));
  })

  test('by default unOrdered is false', () => {
    expect(serializeShortcutKeys(mockKeys)).toEqual(mockKeys.join(ORDERED_KEYS_SEPARATOR));
  })
})

// registerKeys
describe('it should test registerKeys()', () => {
  test('if keys are not existed yet, it should init array for the keys', () => {
    const mockKeysMapToEventHandler = new Map();
    const mockSerializedKeys = 'KeyA, KeyB';
    const mockEventHandler = {
      func: () => {},
      once: true
    }
    registerKeys(mockSerializedKeys, mockKeysMapToEventHandler, mockEventHandler.func, mockEventHandler.once);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys)).toEqual([
      mockEventHandler
    ])
  })

  test('if keys already exist, it should insert the event handler into current array', () => {
    const mockSerializedKeys = 'KeyA, KeyB';
    const mockEventHandler1 = {
      func: () => {},
      once: true
    }
    const mockEventHandler2 = {
      func: () => {}
    }
    const mockKeysMapToEventHandler = new Map([
      [ mockSerializedKeys, [ mockEventHandler1 ] ]
    ])
    registerKeys(mockSerializedKeys, mockKeysMapToEventHandler, mockEventHandler2.func);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys)).toEqual([
      mockEventHandler1,
      {
        func: mockEventHandler2.func,
        once: false
      }
    ])
  })

  test('it should not register the same event handler repeatedly for the same keys', () => {
    const mockSerializedKeys = 'KeyA, KeyB';
    const mockEventHandler = {
      func: () => {},
      once: true
    }
    const mockKeysMapToEventHandler = new Map([
      [ mockSerializedKeys, [ mockEventHandler ]]
    ])
    registerKeys(mockSerializedKeys, mockKeysMapToEventHandler, mockEventHandler.func, mockEventHandler.once);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys)).toEqual([
      mockEventHandler
    ])
  })
})

// deregisterKeys
describe('it should test deregisterKeys', () => {
  test('it should do nothing if there is no event handler array for keys', () => {
    const mockSerializedKeys1 = 'KeyA, KeyB';
    const mockEventHandler1 = {
      func: () => {},
      once: false
    }
    const mockSerializedKeys2 = 'KeyB, KeyC';

    const mockKeysMapToEventHandler = new Map([
      [mockSerializedKeys1, [ mockEventHandler1 ]]
    ]);

    const mockEventHandler2 = {
      func: () => {}
    }
    deregisterKeys(mockSerializedKeys2, mockKeysMapToEventHandler, mockEventHandler2.func);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys1)).toEqual([
      mockEventHandler1
    ])
  })

  test('it should remove event handler from the array for the keys if exist', () => {
    const mockSerializedKeys = 'KeyA, KeyB';
    const mockEventHandler1 = {
      func: () => {},
      once: false
    }
    const mockEventHandler2 = {
      func: () => {},
      once: false
    }
    const mockKeysMapToEventHandler = new Map([
      [ mockSerializedKeys, [ mockEventHandler1, mockEventHandler2 ]]
    ])
    deregisterKeys(mockSerializedKeys, mockKeysMapToEventHandler, mockEventHandler2.func);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys)).toEqual([
      mockEventHandler1
    ])
  })

  test('it should delete keys from the map if the event handler array is empty after removal', () => {
    const mockSerializedKeys = 'KeyA, KeyB';
    const mockEventHandler = {
      func: () => {},
      once: false
    }
    const mockKeysMapToEventHandler = new Map([
      [ mockSerializedKeys, [ mockEventHandler ] ]
    ])
    deregisterKeys(mockSerializedKeys, mockKeysMapToEventHandler, mockEventHandler.func);
    expect(mockKeysMapToEventHandler.get(mockSerializedKeys)).toBeUndefined();
  })
})

// emitShortcut
describe('it should test emitShortcut()', () => {
  const mockScope = 'A';
  const mockScopeMapToShortcut = new Map();
  const mockEventHandler1 = {
    func: jest.fn((e: KeyboardEvent) => {}),
    once: true
  }
  const mockEventHandler2 = {
    func: jest.fn((e: KeyboardEvent) => {}),
    once: false
  }
  const mockSerializedKeys = 'KeyA, KeyB';
  mockScopeMapToShortcut.set(mockScope, new Map([
    [ mockSerializedKeys, [
      mockEventHandler1,
      mockEventHandler2
    ]]
  ]));
  const mockEvent = {} as KeyboardEvent;

  test('it should call event handler if it is registered', () => {
    emitShortcut(mockScopeMapToShortcut, mockScope, mockSerializedKeys, mockEvent, new Set());
    expect(mockEventHandler1.func).toHaveBeenCalledWith(mockEvent);
    expect(mockEventHandler2.func).toHaveBeenCalledWith(mockEvent);
  })

  test('it should add event handler to blockedEventHandlers if eventHandler.once is true', () => {
    const blockedEventHandlers: Set<EventHandler> = new Set();
    emitShortcut(mockScopeMapToShortcut, mockScope, mockSerializedKeys, mockEvent, blockedEventHandlers);
    expect(blockedEventHandlers.has(mockEventHandler1)).toBeTruthy();
  })

  test('it should not call event handler if it is blocked', () => {
    mockEventHandler1.func.mockClear();
    mockEventHandler2.func.mockClear();
    const blockedEventHandlers: Set<EventHandler> = new Set();
    blockedEventHandlers.add(mockEventHandler1);
    emitShortcut(mockScopeMapToShortcut, mockScope, mockSerializedKeys, mockEvent, blockedEventHandlers);
    expect(mockEventHandler1.func).not.toHaveBeenCalled();
    expect(mockEventHandler2.func).toHaveBeenCalled();
  })
})