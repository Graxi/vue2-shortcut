import Vue from 'vue';
import { CreateShortcutParams } from './shortcut';

declare module 'vue/types/vue' {
  interface VueConstructor {
    createShortcuts: (template: Vue, shortcuts: CreateShortcutParams[]) => void;
  }
}