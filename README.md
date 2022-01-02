# V-shortcut

This plugin supports managing web shortcuts in vue framework, in global or custom scope. Currently, it works on Vue2 and Vue3.

## Usage

This plugin uses key value of [KeyboardEvent: code values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values).

The below is some examples on Windows system.
|Key Type|Key Value|
|---|---|
|Modifier|Alt, Ctrl, Meta, Shift|
|Digit|Digit{0-9}|
|Letter|Key{A-Z}|
|Symbol|Bracket{Left/Right}, Minus, Equal, Backquote, Backslash, etc.|
|Special|Enter, Backspace|

```ts
import v-shortcut;
Vue.createShortcuts([
{
    keyGroup: [['ctrl', 'c']],
    scope: ['a'],
    eventHandler: () => {
    console.log('pressing ctrl + c in scope a');
    },
    once: true
}
])
```

## Help

### `Error:0308010C:digital envelope routines::unsupported`

To resolve this error, Node.js needs to be downgraded to v16 or enabled compatible option of openssl. See more at https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported

## Contributors

## License
