import Vue from 'vue';
import { CreateShortcutParams, ShortcutsList } from './shortcut';

declare module 'vue/types/vue' {
  interface VueConstructor {
    createShortcuts: (component: Vue, shortcuts: CreateShortcutParams[]) => void;
    getAvailableShortcuts: () => ShortcutsList;
  }
}