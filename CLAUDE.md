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

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm typecheck
```

**⚠️ 禁止命令**：
- ❌ **禁止使用 `pnpm dev`**：开发服务器会一直挂在后台，无法管理
- ✅ 用户自己负责启动开发服务器
- ✅ 如需验证代码，使用 `pnpm typecheck` 或 `pnpm build`

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

**禁止使用类型断言绕过类型检查**

- ❌ **禁止使用 `as any`**：`const value = unknownValue as any`
- ❌ **禁止使用 `as unknown as xxx`**：`const value = unknownValue as unknown as SpecificType`
- ✅ **正确做法**：
  - 使用类型守卫：`if (typeof value === 'string') { ... }`
  - 使用泛型：`function identity<T>(value: T): T { return value }`
  - 定义明确的类型接口
  - 使用类型断言时指定具体类型：`value as SpecificType`
  - 使用类型收窄：`value is SpecificType`

**理由**：
- `as any` 和 `as unknown as xxx` 会完全破坏 TypeScript 的类型检查
- 掩盖真实的问题，导致运行时错误
- 违背了项目使用 TypeScript 的初衷
- 使代码维护变得困难

如果遇到类型问题，应该：
1. 检查类型定义是否正确
2. 使用类型守卫进行类型收窄
3. 改进类型定义，而不是绕过类型检查
4. 使用 Zod 或类似库进行运行时验证

### 类型定义架构（CRITICAL）

**原则：基于自动生成的 API 类型派生，避免重复定义**

项目使用 OpenAPI 自动生成 API 类型（`@/core/api/generated`），所有业务类型应通过类型运算从这些 API 类型派生。

**类型层次结构**：
```
src/
├── core/api/generated/    # 自动生成的 API 类型（单一数据源）
│   └── types.gen.ts       # ← 所有类型定义的源���
├── features/
│   ├── shared/
│   │   └── types/         # 通用工具类型（跨 feature 共享）
│   │       ├── utils.ts   # FormData 等工具类型
│   │       ├── form.ts    # FormFieldConfig 等
│   │       ├── table.ts   # TableColumn 等
│   │       └── index.ts
│   └── teacher/
│       ├── types/         # 老师 feature 特定类型
│       │   ├── class.ts        # 基于 Class, ClassResponse 等
│       │   ├── experiment.ts   # 基于 ExperimentInfo 等
│       │   ├── submission.ts   # 基于 ProcedureSubmissionResponse 等
│       │   └── index.ts        # 统一导出
│       └── constants/     # 老师 feature 常量
```

**类型定义规则**：
1. ✅ **使用类型别名**：`export type ClassEntity = Class`
2. ✅ **使用工具类型**：`export type ClassFormData = FormData<CreateClassRequest>`
3. ✅ **从 API 类型导入**：`import type { Class, CreateClassRequest } from '@/core/api/generated'`
4. ❌ **禁止重复定义**：不要手动写与 API 类型相同的接口
5. ❌ **禁止手动定义 Schema**：不要自己写 JSON Schema，使用 API 类型

**示例**：
```typescript
// ✅ 正确：从 API 类型派生
import type { Class, CreateClassRequest } from '@/core/api/generated'
import type { FormData } from '@/features/shared/types'

export type ClassEntity = Class
export type ClassFormData = FormData<CreateClassRequest>

// ❌ 错误：重复定义
export interface ClassEntity {
  id: string
  className: string  // 这些字段 API 已经定义了！
}
```

### UI 框架规范

项目使用 **PrimeVue** 作为 UI 组件库（已从 Element Plus 迁移）。

**组件使用原则**：
- ✅ **优先使用 PrimeVue 组件**：能使用 PrimeVue 组件库就使用组件库
- 自动导入已配置，无需手动 import：`<Card>`, `<Button>`, `<DataTable>` 等
- 图标使用 PrimeIcons：`<i class="pi pi-home" />`
- 避免重复造轮子，先检查 PrimeVue 是否有满足需求的组件

**Toast 消息提示**：

项目有全局 Toast 服务，可在任何地方使用：

**在组件中**（推荐使用 `useToast()`）：
```typescript
import { useToast } from 'primevue/usetoast'

const toast = useToast()
toast.add({ severity: 'success', summary: '成功', detail: '登录成功', life: 3000 })
```

**在组件外**（如拦截器、工具函数）：
```typescript
import { toast } from '@/core/utils/toast'

toast.error('错误消息')
toast.success('成功消息')
toast.warn('警告消息')
```

**Toast 类型导入规则**：
- `ToastMessageOptions` → 从 `'primevue/toast'` 导入
- `ToastServiceMethods` → 从 `'primevue/toastservice'` 导入
- 不要手动定义 Toast 相关接口

**全局配置**：
- `App.vue` 必须包含 `<Toast />` 组件
- `main.ts` 已初始化全局 Toast 服务

### 样式规范（CRITICAL）

**禁止使用 `<style>` 标签**

- ❌ **禁止在 `.vue` 文件中使用 `<style>` 标签**
- ✅ **只允许使用 TailwindCSS 修改样式**
- ✅ **使用 PrimeVue 组件的内置样式属性**：`class`, `pt`（pass through）等

**样式编写规则**：
1. **使用 TailwindCSS 工具类**：
   ```vue
   <!-- ✅ 正确 -->
   <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
     <h2 class="text-xl font-semibold text-gray-900">标题</h2>
   </div>

   <!-- ❌ 错误 -->
   <div class="container">
     <h2 class="title">标题</h2>
   </div>
   <style scoped>
   .container { display: flex; padding: 1rem; }
   .title { font-size: 1.25rem; font-weight: 600; }
   </style>
   ```

2. **使用 PrimeVue 组件的样式属性**：
   ```vue
   <!-- ✅ 正确：使用 PrimeVue 组件的 class 和 pt 属性 -->
   <Button class="p-button-lg" pt:root:class="custom-button">
     点击
   </Button>
   ```

3. **动态样式**：
   ```vue
   <!-- ✅ 正确：使用动态 class 绑定 -->
   <div :class="['flex', isActive ? 'bg-blue-500' : 'bg-gray-200']">
     内容
   </div>
   ```

**理由**：
- 统一样式系统，避免样式冲突
- 提高代码可维护性
- 减小打包体积
- 更好的开发体验和性能
- 保持项目风格一致性

**例外情况**：
- 如确实需要自定义 CSS，应在全局样式文件中定义（需经团队讨论批准）
- 第三方组件库的样式覆盖除外
