type Func = (e?: KeyboardEvent) => void;

type EventHandler = {
  func: Func;
  once?: boolean;
};

type KeysMapToEventHandler = Map<string, EventHandler[]>;

type ScopeMapToShortcut = Map<string, KeysMapToEventHandler>;

type Keys = string[]; // multiple keys may serve the same function

type ShortcutsList = {
  [scope: string]: { keys: Keys }[];
};

type CreateShortcutParams = {
  scope?: string[]; // no scope means global
  keys: Keys; // for now only consider one key combo
  eventHandler: Func;
  once?: boolean;
  unOrdered?: boolean;
};

type CheckPreventFunction = (e?: KeyboardEvent) => boolean;

type Options = {
  excludeTags?: string[];
  preventWhen?: CheckPreventFunction;
};

export {
  Func,
  EventHandler,
  KeysMapToEventHandler,
  ScopeMapToShortcut,
  Keys,
  ShortcutsList,
  CreateShortcutParams,
  CheckPreventFunction,
  Options,
};
