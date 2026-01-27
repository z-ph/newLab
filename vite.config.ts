import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import OpenAPI from "vite-plugin-openapi-ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "./src/pages",
      extensions: [".page.vue"],
      dts: "./typed-router.d.ts",
    }),
    // ⚠️ Vue 必须放在 VueRouter() 之后
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // OpenAPI({
    //   /* OpenAPI 类型生成配置 */
    // }),
  ],
});
