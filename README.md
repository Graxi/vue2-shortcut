# V-shortcut

This plugin supports managing web shortcuts in vue framework

## Usage

```ts
Vue.createShortcuts(this, [
  {
    keys: ["Ctrl", "KeyC"],
    scope: ["a"],
    eventHandler: () => {
      console.log("pressing ctrl + c in scope a");
    },
    once: true, // default false
    unOrdered: true // default false
  },
]);
```

## Feature

### Keys

This plugin uses key value of [KeyboardEvent: code values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values) for windows system.

The below is some examples of code values.
|Key Type|Key Value|
|---|---|
|Modifier|Alt, Ctrl, Meta, Shift|
|Digit|Digit{0-9}|
|Letter|Key{A-Z}|
|Symbol|Bracket{Left/Right}, Minus, Equal, Backquote, Backslash, etc.|
|Special|Enter, Backspace|

- Support multiple key combinations, such as arrays ['key1', 'key2', ... , 'keyN']
- Merge `control` in Mac and `Ctrl` in Windows into `Ctrl` for less confusion.

### Scope

- Support self-define the `scope` of event and global scope by default
- Can apply the same event on multiple scopes as ['scope1', 'scope2', ... , 'scopeN']

<!-- TODO:  `excludeTags` and `preventWhen` -->

### Once

By default, a shortcut can raise an event more than once, but the parameter `once` be defined as true to raise the event only once.

### Ordering

Shortcuts are triggered sequentially by default, use `unOrder: true` to apply one combination of shortcut keys can raise event in any sequence.

## Help

### `Error:0308010C:digital envelope routines::unsupported`

To resolve this error, Node.js needs to be downgraded to v16 or enabled compatible option of openssl. See more at https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported

## Contributors

## License
