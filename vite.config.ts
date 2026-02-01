import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { createClient } from "@hey-api/openapi-ts";
import type { Plugin } from "vite";
import { rmSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";

/**
 * 创建 @hey-api/openapi-ts 插件
 * 在 Vite 启动时自动生成 API 客户端代码
 */
function createHeyApiPlugin(openApiUrl: string): Plugin {
  return {
    name: 'hey-api-plugin',
    enforce: 'pre',
    configResolved: async () => {
      const outputDir = './src/core/api/generated';

      // 清理旧的生成文件，避免文件冲突
      try {
        rmSync(outputDir, { recursive: true, force: true });
      } catch (error) {
        // 忽略清理错误
      }

      // 生成新的客户端代码
      await createClient({
        input: openApiUrl,
        output: outputDir,
        plugins: [
          "@hey-api/typescript",
          "@hey-api/sdk",
          "@hey-api/client-axios"
        ]
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.PREFIX_PATH || '/',
    plugins: [
      tailwindcss(),
      VueRouter({
        routesFolder: "./src/pages",
        extensions: [".page.vue"],
        dts: "./typed-router.d.ts",
      }),
      // ⚠️ Vue 必须放在 VueRouter() 之后
      vue(),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      createHeyApiPlugin(env.VITE_OPENAPI_URL),
    ],
    // 开发环境下生成 sourcemap，便于调试
    build: {
      sourcemap: mode === 'development',
    },
    server:{
      proxy:{
        '/api': {
          target: env.BASE_API || 'http://localhost:8085',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
