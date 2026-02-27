import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_PREFIX_PATH || '/',
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
