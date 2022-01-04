# Vue2-shortcut

Vue2-shortcut 是一个在 vue 项目中管理快捷键的插件，适用于全局和局部自定义范围的添加和删除快捷键。可直接在`<script></script>`中使用这一插件，无需作为一个组件导入模板。

## 安装

```zsh
npm install --save vue2-shortcut
```

以上命令除安装插件 Vue2-shortcut 之外，也将其作为依赖项保存到 package.json 文件。可以直接使用`import vShortcut from 'vue2-shortcut';`在`main.js`中导入插件。

## 快捷键添加方法

为了更直观地了解 Vue2-shortcut 的使用，建议查看 demo 中的代码。这里有一个沙盒[demo](https://codesandbox.io/s/vue2-shortcut-demo-quoui?file=/src/components/Playground.vue)，可以创建任意快捷键和对应的事件。

下面是一个典型的快捷键注册方法，需要通过`mounted()` Hook 将快捷键注册到 DOM：

```js
mounted(){
    Vue.createShortcuts(this, [
        {
            keys: ['Ctrl', 'KeyC'],
            scope: ['a'],
            eventHandler: () => {
                console.log('pressing ctrl + c in scope a');
            },
            once: true
        }
	])
}
```

## 功能

在上面的示例中，可以看到有`keys`，`scope`，`eventHandler`，`once`四个参数，除此之外，Vue2-shortcut还支持快捷键是否要按顺序触发，即参数`unOrder`。

### Keys

Vue2-shortcut使用[KeyboardEvent: code values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values#select-language)来表示键值。


<!-- Vue2-shortcut将虚拟键`Ctrl`来表示左右控制键。 -->

以下是一些常用键位的例子。
|类型|键值|
|---|---|
|修饰键|Alt, Ctrl, Meta, Shift|
|数字|Digit{0-9}|
|字母|Key{A-Z}|
|符号|Bracket{Left/Right}, Minus, Equal, Backquote, Backslash, etc.|

注意虚拟键`Ctrl`合并了*ControlLeft*和*ControlRight*，和虚拟键`Alt`, `Shift`一样。如果有使用单一键位的需求，可在键位名字右边加上*Left*或者*Right*。

### Scope

### Once

### unOrder

### excludeTags和preventWhen

## 快捷键的删除

## Contributors

## License