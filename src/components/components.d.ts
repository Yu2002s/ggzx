import SvgIconVue from './SvgIcon/index.vue'

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIconVue
  }
}
