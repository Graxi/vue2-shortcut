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
Check demo [here](https://codesandbox.io/s/vue2-shortcut-demo-quoui?file=/src/components/Playground.vue)

#### Register shortcuts
Register your shortcuts in any vue template under the **mounted** hook
```
  mounted() {
    Vue.createShortcuts(this, [
      {
        keys: ['ctrl', 'c'],
        scope: ['a'],
        eventHandler: () => {
          console.log('pressing ctrl + c in scope a');
        },
        once: true
      }
    ])
  }
```

#### Key List

Below is the list of keys mapping. Use `ctrl` if you want the shortcut to work with `meta` on mac and `control` on windows.

| Keyboard     | shortcut key |
| ------------ | ------------ |
| A - Z        | a - z        |
| 0 - 9        | 0 - 9        |
| F1 - F12     | f1 - f12     |
| Escape       | esc          |
| Backquote    | backquote    |
| Minus        | minus        |
| Equal        | equal        |
| Backspace    | backspace    |
| Tab          | tab          |
| CapsLock     | capslock     |
| Space        | space        |
| Pause        | pause        |
| Delete       | delete       |
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

#### 关于keys
- keybinding默认是keydown事件里**event.code** **这里需要注意的是 ctrl是由插件定义出来的virtual key** 因为在mac和windows系统下一个是Meta 一个是Control 为了避免开发者区别定义 使用Ctrl即可 插件会判断到底检测Meta还是Control

#### 关于scope
- 当注册的快捷键是全局通用时 不需要传入scope; 如果非全局事件 scope为一个字符串组成的数组
- 定义scope的原因是为了将快捷键限制在一个范围 scope是用户通过在dom元素上添加v-shortcut-scope这个directive确定的 比如
```
  <div v-shortcut-scope="'b'">
    Component B
  </div>
```
- 我们根据用户最后鼠标点击的区域来确定当前的scope 从而匹配相关的快捷键 比如用户最后一次点击是在Component B 之后只会触发注册在scope b下的快捷键以及全局快捷键

#### 关于once
对于很多key来说 keydown事件是不断被调用的 也许用户只希望按下快捷键之后 注册的事件只被执行一次 而不是重复地执行 vue-shortkey也有提供`once`选项 所以在注册快捷键时我们允许用户给单个快捷键配置`once` 默认情况下`once`值为false 除非设置为true keyup后会自动reset
```
  Vue.createShortcuts(this, [
    {
      keys: ['Ctrl', 'KeyC'],
      scope: ['a'],
      eventHandler: () => {
        console.log('pressing ctrl + c in scope a');
        console.log('executed repeatedly');
        console.log('*************');
      }
   },
   {
     keys: ['Ctrl', 'KeyC'],
     eventHandler: () => {
       console.log('pressing ctrl + c in global scope');
       console.log('executed once');
       console.log('*************');
     },
     once: true
   }
])
```

#### 关于unordered
注册快捷键时 默认情况下 所有的keys是依次触发的 unordered的作用是允许这些keys可以无序输入 用法如下
```
  Vue.createShortcuts(this, [
    {
      keys: ['Ctrl', 'KeyE'],
      eventHandler: () => {
        console.log('pressing ctrl + e in order');
      },
    },
    {
      keys: ['Ctrl', 'KeyE'],
      eventHandler: () => {
        console.log('pressing ctrl + e regardless of order');
      },
      unOrdered: true
    }
  ])
```

#### 关于excludeTags和preventWhen
在安装插件时 可以设置`excludeTags`和`preventWhen` 比如
```
  Vue.use(VShortcut, {
    excludeTags: ['input', 'textarea'],
    preventWhen: () => true
  })
```
- 插件默认的`excludeTags`是input 和 textarea 意味着在这两个html tag里运行快捷键时 会被当做文本输入处理
- `preventWhen`是让用户全局设置拦截快捷键的方法 比如一些场景不希望触发快捷键但又跟html tags无关

#### 关于快捷键事件监听的添加和删除
- 在v-shortcut里 只需要按照说明在模板里注册事件 无需引入其他的component v-shortcut会自动在模板被destroy之后删除之前注册的事件监听

#### 目前还在开发中的功能
- 给定义的快捷键添加description 允许用户定义快捷键的描述 插件自带一个含有所有快捷键的popup
