## vue2-shortcut

Vue2.x plugin to create scoped or global shortcuts.
No need to import a vue component into the template.

![AppVeyor](https://img.shields.io/appveyor/build/Graxi/vue2-shortcut)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/0831c96d38034ebd880d79448fb3c934)](https://www.codacy.com/gh/Graxi/vue2-shortcut/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Graxi/vue2-shortcut&amp;utm_campaign=Badge_Grade)

### Install
```bash
$ npm install --save vue2-shortcut
```

### Usage
```
import Vue from 'vue';
import vShortcut from 'vue2-shortcut';
Vue.use(vShortcut);
```

#### Optional global config
You can define `excludeTags` or customized `preventWhen` function globally to prevent shortcuts from being executed
- `excludeTags`: a list of html tags where shortcuts should not be triggered
- `preventWhen`: a global interceptor function which returns `true`

```
  Vue.use(vShortcut, {
    excludeTags: ['input', 'textarea'],
    preventWhen: (e) => true // prevents all shortcuts
  })
```

Check the demo [here](https://codesandbox.io/s/vue2-shortcut-demo-quoui?file=/src/components/Playground.vue)

#### Define scopes for shortcuts
By default, the shorcuts will work globally. Optionally, if you want to restrict shorcuts within certain scopes, it's also easy to define a scope in vue template like this:
```
  <div v-shortcut-scope="'a'">
    Component A
  </div>
```
Then you could pass `['a']` as value for the `scope` property when creating shortcuts. In this way, shorcuts are triggered only when you are currently interacting with *Component A*

#### Register shortcuts
Register your shortcuts in any vue template under the **mounted** hook
```
  mounted() {
    Vue.createShortcuts(this, [
      {
        keys: ['ctrl', 'c'],
        scope: ['a'], // optional
        eventHandler: () => {
          console.log('pressing ctrl and c in scope a');
          console.log('executed once');
        },
        once: true, // optional, false by default
        unordered: true // optional, false by default
      }
    ])
  }
```

#### Deregister shortcuts
When the template is destroyed, shortcuts registered in that template will be removed automatically

#### Key List
Below is the list of keys mapping. Use `ctrl` if you want a shortcut to work with `meta` on mac and `control` on windows.

| Keyboard     | shortcut key |
| ------------ | ------------ |
| A - Z        | a - z        |
| 0 - 9        | 0 - 9        |
| F1 - F12     | f1 - f12     |
| Escape       | esc          |
| Backquote    | backquote    |
| Minus        | minus        |
| Equal        | equal        |
| Backspace    | del          |
| Tab          | tab          |
| CapsLock     | capslock     |
| Space        | space        |
| Pause        | pause        |
| Delete       | del          |
| ContextMenu  | contextmenu  |
| BracketLeft  | bracketleft  |
| BracketRight | bracketright |
| Backslash    | backslash    |
| Semicolon    | semicolon    |
| Quote        | quote        |
| Enter        | enter        |
| Comma        | comma        |
| Period       | period       |
| Slash        | slash        |
| ArrowLeft    | arrowleft    |
| ArrowUp      | arrowup      |
| ArrowRight   | arrowright   |
| ArrowDown    | arrowdown    |
| Control      | control      |
| Shift        | shift        |
| Alt          | alt          |
| Meta         | meta         |