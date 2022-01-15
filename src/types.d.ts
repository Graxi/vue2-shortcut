type Func = (e?: KeyboardEvent) => void;

type EventHandler = {
  func: Func;
  once?: boolean;
};

type KeysMapToEventHandler = Map<string, EventHandler[]>;

type ScopeMapToShortcuts = Map<string, KeysMapToEventHandler>;

type Keys = string[]; // multiple keys may serve the same function

type ShortcutsList = {
  [scope: string]: { originalKeys: Keys; description: string | undefined }[];
};

type CreateShortcutParams = {
  scope?: string[]; // no scope means global
  keys: Keys; // for now only consider one key combo
  eventHandler: Func;
  once?: boolean;
  unOrdered?: boolean;
  description?: string;
};

type CheckPreventFunction = (e?: KeyboardEvent) => boolean;

type Options = {
  excludeTags?: string[];
  preventWhen?: CheckPreventFunction;
};

// serialized keys map to original keys with description
type KeysMapping = Map<
  string,
  {
    originalKeys: Keys;
    description: string | undefined;
  }
>;

export {
  Func,
  EventHandler,
  KeysMapToEventHandler,
  ScopeMapToShortcuts,
  Keys,
  ShortcutsList,
  CreateShortcutParams,
  CheckPreventFunction,
  Options,
  KeysMapping,
};
