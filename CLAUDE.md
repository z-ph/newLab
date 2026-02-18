# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Vue 3 + TypeScript + Vite 前端项目，使用 pnpm 包管理。

核心特性：
- **文件路由自动生成**：unplugin-vue-router
- **OpenAPI 类型生成**：vite-plugin-openapi-ts
- **完整类型安全**

## 常用命令

```bash
pnpm install      # 安装依赖
pnpm build        # 构建生产版本
pnpm preview      # 预览生产构建
pnpm typecheck    # 类型检查
```

⚠️ **禁止使用 `pnpm dev`**（开发服务器后台运行，无法管理）

## 工作流程规范（CRITICAL）

**任务开始前必须运行 `pnpm typecheck` 确立错误边界**

只关注由本次修改引入的类���错误，忽略既有错误。

## 架构配置

### 项目结构

```
src/
├── pages/           # 页面组件（自动生成路由）
├── components/      # 可复用组件
├── router.ts        # 路由配置
├── main.ts          # 应用入口
└── App.vue          # 根组件
```

### 路由系统

- 路由生成：`src/pages/index.vue` → `/`，`src/pages/users/[id].vue` → `/users/:id`
- 类型安全导航：`import { routes } from 'vue-router/auto-routes'`

### 核心配置

- **vite.config.ts**：插件顺序 VueRouter → vue → OpenAPI
- **tsconfig.app.json**：必须包含 `"./typed-router.d.ts"`，`moduleResolution: "Bundler"`

## 学生端架构设计（CRITICAL）

**以课程为中心的层级式导航**

```
课程列表 (/student/index) → 课程详情 (/student/courses/[courseId]) → 实验详情 (/student/courses/[courseId]/experiments/[expId])
```

**实验详情页功能聚合**：签到 + 实验步骤 + 提交（使用 Tabs）

**展示规范**：展示名称字段（`courseName`、`experimentName`）而非 ID

## 代码规范

### 类型安全（CRITICAL）

❌ **禁止使用 `as any`、`as unknown as xxx`**
✅ 使用类型守卫、泛型、具体类型断言

### 类型定义（CRITICAL）

**核心原则：基于 API 类型派生，避免重复定义**

- ✅ 使用类型别名：`export type ClassEntity = Class`
- ✅ 使用工具类型：`export type FormData = Partial<CreateRequest>`
- ✅ 使用 `satisfies` 保留精确类型推断
- ❌ 禁止重复定义 API 已有的类型
- ❌ 禁止使用原始类型（`string`、`number`）定义字段
- ❌ 禁止擅自添加 API 中不存在的字段

**字段类型必须从 API 派生**：
```typescript
// ✅ 正确
export type CourseInfo = {
  courseId: ClassExperimentDetailResponse['courseId']
  courseName: ClassExperimentDetailResponse['courseName']
}
```

### UI 框架

- 使用 **PrimeVue**（已从 Element Plus 迁移）
- 图标使用 PrimeIcons：`<i class="pi pi-home" />`
- Toast：组件内 `useToast()`，组件外 `import { toast } from '@/core/utils/toast'`

**表单控件**：
- ✅ 选择场景使用 `Select`（绑定值）
- ⚠️ `Dropdown` 仅用于操作菜单（不绑定值）

**Tabs 组件**：
- ✅ 使用 `Tabs` + `TabList` + `Tab` + `TabPanels` + `TabPanel`
- ❌ 禁止使用已弃用的 `TabView`

### 样式（CRITICAL）

❌ **禁止使用 `<style>` 标签**
✅ 只使用 TailwindCSS 和 PrimeVue 样式属性

### Vue 组件（CRITICAL）

**双向绑定使用 `defineModel()`**
```typescript
// ✅ 正确
const visible = defineModel<boolean>()

// ❌ 错误：不要这样写
interface Props { modelValue: boolean }
const props = defineProps<Props>()
const emit = defineEmits()
```

**对话框状态管理**
- ✅ 状态封装在组件内部，使用 `defineExpose` 暴露 `open()` 方法
- ❌ 禁止在父组件管理对话框状态

**组件数据获取**
- ✅ 组件内部调用 hook，利用 Vue Query 缓存
- ✅ Props 只用于配置参数，Emits 只用于事件通知
- ❌ 禁止通过 props 传递数据

### 表格组件设计（CRITICAL）

- ✅ 表格内部调用查询和 mutation hook
- ✅ 通过 slot 传递 header
- ❌ 禁止通过 props 传递数据

### 工具函数和常量组织（CRITICAL）

**工具函数**：
- ✅ 放在 `utils/` 目录（formatters、validators、helpers）
- ❌ 禁止在组件内部定义

**常量**：
- ✅ 放在 `constants/` 目录（types、status、messages、config）
- ✅ 避免 Magic Number，使用有意义的常量名
- ❌ 禁止在组件内部定义

### Hook 封装（CRITICAL）

- ❌ **禁止组件直接调用 API**
- ✅ 所有 API 调用封装在 hook 中（查询用 `useQuery`，变更用 `useMutation`）
- ✅ 必须传入自定义 client（从 `@/core/api/config` 导入）
- ✅ Query 必须添加 `select` 字段提取数据
- ✅ queryKey 必须使用响应式数据（`Ref`、`computed`）
- ✅ 调用 Hook 时直接传递 ref，不要使用 `.value`
- ✅ Hook 内部定义页面级状态（filters、current、size）
- ✅ 数据解析、校验在 hook 的 `onSuccess` 中处理

**Hook 模板**：
```typescript
import { postApiTeacherClassQuery } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

export function useQueryClass() {
  return useQuery({
    queryKey: ['class'],
    queryFn: () => postApiTeacherClassQuery({
      body: { pageable: false },
      client,  // ✅ 必须传入
    }),
    select: (res) => res.data?.data,  // ✅ 提取数据
  })
}
```

### 错误处理（CRITICAL）

❌ **禁止使用 try-catch 包裹 mutation**（全局错误处理已自动处理）

### 功能开发工作流（CRITICAL）

**三层架构：API → Feature → Page**

```
API 层（自动生成）
  ↓
Feature 层（hooks + components + utils）
  ↓
Page 层（只做组装）
```

**开发步骤**：
1. 确认 API 已生成
2. 创建 Feature Hooks（使用 API，传入 client）
3. 创建 Feature 组件（使用 defineModel、PrimeVue、TailwindCSS）
4. 创建 Page 组件（只做组装，不写业务逻辑）
