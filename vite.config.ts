import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createClient } from "@hey-api/openapi-ts";
import type { Plugin } from "vite";

/**
 * 创建 @hey-api/openapi-ts 插件
 * 在 Vite 启动时自动生成 API 客户端代码
 */
function createHeyApiPlugin(): Plugin {
  return {
    name: 'hey-api-plugin',
    enforce: 'pre',
    configResolved: async () => {
      await createClient({
        input: "http://127.0.0.1:4523/export/openapi/3?version=3.1",
        output: "./src/api/generated",
        plugins: [
          "@hey-api/typescript",
          "@hey-api/sdk",
          "@hey-api/client-fetch"
        ]
      });
    },
  };
}

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
    createHeyApiPlugin(),
  ],
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
