import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://127.0.0.1:4523/export/openapi/3?version=3.1',
  output: 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@hey-api/client-fetch'
  ],
  // 客户端配置
  client: '@hey-api/client-fetch',
  // 使用相对于 /api 的路径
  pathParamsAsTypes: true,
});
