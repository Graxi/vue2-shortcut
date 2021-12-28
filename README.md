# V-shortcut

Vue3 plugin for creating shortcuts to web pages in globally and customized scope.

<!-- ## Description -->
<!-- TODO Explain KeyGroup, Scope, once, excludeTags and preventWhen  -->

## Getting Started

### Dependencies

<!-- FIXME Compatible with other versions of Vue? -->
Vue3
<!-- FIXME Supported Version of Nodejs? -->
Nodejs

### Development

```sh
git clone https://github.com/Graxi/v-shortcut.git
cd v-shortcut
# Project setup
npm install
# Compile and hot-reload for development
npm run serve
# Compile and minify for production
npm run bild
# Run your test
npm run test
# Lint and fix code
npm run lint
```

### Usage

<!-- FIXME which name of this plugin should be imported -->
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

<!-- TODO ## Contributors -->

<!-- TODO ## License -->

<!-- TODO ## Acknowledgments 
    This section may mention vue-shortkey and vue-global-events.
-->
