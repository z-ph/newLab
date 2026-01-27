# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + TypeScript + Vite 的前端项目，使用 pnpm 作为包管理器。

核心特性：
- **文件路由自动生成**：使用 unplugin-vue-router 基于文件系统自动生成路由
- **OpenAPI 类型生成**：使用 vite-plugin-openapi-ts 从 OpenAPI 规范生成 TypeScript 类型
- **类型安全**：完整的 TypeScript 支持，包括自动生成的路由类型

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（会自动生成路由类型文件）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

**重要提示**：首次运行或添加新路由后，必须执行 `pnpm dev` 来生成/更新 `typed-router.d.ts` 类型文件。

## 架构与配置

### 项目结构

```
src/
├── pages/           # 页面组件（自动生成路由）
│   └── index.vue    # 首页 (/)
├── components/      # 可复用组件
├── router.ts        # 路由配置（使用自动生成的路由）
├── main.ts          # 应用入口
└── App.vue          # 根组件
```

### 核心配置文件

- **vite.config.ts**：Vite 配置，包含三个关键插件的配置
  1. `VueRouter`：文件路由自动生成（必须在 Vue 插件之前）
  2. `vue()`：Vue 单文件组件支持
  3. `OpenAPI`：OpenAPI 类型生成

- **tsconfig.app.json**：TypeScript 应用配置
  - 必须包含 `"./typed-router.d.ts"` 以获得路由类型支持
  - `"moduleResolution": "Bundler"` 是必需的
  - types 包含 `"unplugin-vue-router/client"`

- **env.d.ts**：全局类型声明文件
  ```ts
  /// <reference types="vite/client" />
  /// <reference types="unplugin-vue-router/client" />
  ```

### 路由系统

项目使用 unplugin-vue-router 实现基于文件的路由自动生成：

1. **路由生成规则**：
   - `src/pages/index.vue` → `/`
   - `src/pages/about.vue` → `/about`
   - `src/pages/users/index.vue` → `/users`
   - `src/pages/users/[id].vue` → `/users/:id`

2. **路由导入**：
   ```ts
   import { routes } from 'vue-router/auto-routes'
   ```

3. **类型安全导航**：
   - 使用 `router.push()` 时会获得完整的类型提示
   - 路由参数和查询参数都是类型安全的

### OpenAPI 集成

vite-plugin-openapi-ts 插件用于从 OpenAPI 规范生成 TypeScript 类型。配置需要在 vite.config.ts 中添加选项。

## 开发注意事项

1. **类型生成**：
   - 每次添加新页面或修改路由结构后，运行 `pnpm dev` 生成类型
   - `typed-router.d.ts` 是自动生成的，不要手动编辑

2. **页面组件**：
   - 在 `src/pages/` 中创建 `.vue` 文件会自动成为路由
   - 使用 `[param].vue` 语法创建动态路由
   - 使用 `index.vue` 作为目录的默认页面

3. **插件顺序**：
   - vite.config.ts 中的插件顺序很重要：VueRouter → vue → OpenAPI

4. **TypeScript 配置**：
   - 确保 tsconfig.app.json 的 include 数组包含 `"typed-router.d.ts"`
   - moduleResolution 必须设置为 "Bundler"

## 代码规范

### 类型安全（CRITICAL）

**禁止使用 `as any` 类型断言**

- ❌ **禁止**：`const value = unknownValue as any`
- ✅ **正确做法**：
  - 使用类型守卫：`if (typeof value === 'string') { ... }`
  - 使用泛型：`function identity<T>(value: T): T { return value }`
  - 定义明确的类型接口
  - 使用类型断言时指定具体类型：`value as SpecificType`

**理由**：
- `as any` 会完全破坏 TypeScript 的类型检查
- 掩盖真实的问题，导致运行时错误
- 违背了项目使用 TypeScript 的初衷

如果遇到类型问题，应该：
1. 检查类型定义是否正确
2. 使用类型守卫进行类型收窄
3. 改进类型定义，而不是绕过类型检查
