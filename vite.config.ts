import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import OpenAPI from 'vite-plugin-openapi-ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      /* 路由自动生成配置 */
    }),
    // ⚠️ Vue 必须放在 VueRouter() 之后
    vue(),
    OpenAPI({
      /* OpenAPI 类型生成配置 */
    }),
  ],
})
