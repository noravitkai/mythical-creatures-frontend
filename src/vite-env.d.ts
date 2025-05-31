/// <reference types="vite/client" />

// Allow importing .vue files in TS
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
