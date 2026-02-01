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

## 工作流程规范（CRITICAL）

**任务开始前必须确立错误边界**

在开始任何代码修改任务前，必须先运行 `pnpm typecheck` 确立当前的类型检查状态：

```bash
# 任务开始前运行
pnpm typecheck
```

**错误边界原则**：
- ✅ **记录初始状态**：记住任务开始前就存在的类型错误
- ✅ **只关注新增错误**：只处理由本次修改引入的类型错误
- ❌ **忽略既有错误**：不要修复任务范围之外的类型错误（除非明确要求）

**示例场景**：
```bash
# 任务开始前
pnpm typecheck
# 输出：src/features/old-module/example.ts:10:5 - error: 此错误已存在
# ✅ 记录：这个错误不是本次任务导致的

# 任务进行中
pnpm typecheck
# 输出：
#   src/features/old-module/example.ts:10:5 - error: 此错误已存在
#   src/pages/new-feature.vue:25:3 - error: 新增的错误
# ✅ 只处理：src/pages/new-feature.vue 的新错误
# ❌ 忽略：src/features/old-module/example.ts 的旧错误
```

**理由**：
- 防止范围蔓延：聚焦当前任务，不陷入修复无关问题的陷阱
- 时间可控：避免因修复既有错误导致任务时间不可预测
- 责任清晰：明确哪些错误是本次引入的，哪些是历史遗留
- 效率优先：快速完成当前任务，而不是追求完美的代码库

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

## 学生端架构设计（CRITICAL）

**核心设计理念：以课程为中心**

学生端采用层级式导航结构，所有功能模块都是课程的附属模块，而不是平铺式的独立模块。

### 导航层级结构

```
┌─────────────────────────────────────────────────┐
│  第一层：首页（课程列表）                         │
│  /student/index                                 │
│  展示学生加入的所有课程                           │
└─────────────────┬───────────────────────────────┘
                  │ 点击课程
                  ▼
┌─────────────────────────────────────────────────┐
│  第二层：课程详情（实验列表）                     │
│  /student/courses/[courseId]                    │
│  展示该课程的所有实验                             │
└─────────────────┬───────────────────────────────┘
                  │ 点击实验
                  ▼
┌─────────────────────────────────────────────────┐
│  第三层：实验详情（功能聚合页）                   │
│  /student/courses/[courseId]/experiments/[expId]│
│  包含：签到 + 实验步骤 + 提交                     │
└─────────────────────────────────────────────────┘
```

### 路由结构规范

**第一层：课程列表**
```
/student/index.vue 或 /student/courses/index.vue
```
- 展示学生加入的所有课程
- 每个课程卡片显示：课程名称、教师、进度等
- 点击课程 → 进入课程详情

**第二层：课程详情（实验列表）**
```
/student/courses/[courseId]/index.vue
```
- 展示该课程的所有实验
- 实验列表显示：实验名称、状态、进度等
- 点击实验 → 进入实验详情

**第三层：实验详情（功能聚合页）**
```
/student/courses/[courseId]/experiments/[experimentId].page.vue
```
- **功能聚合**：签到 + 实验步骤 + 提交
- 使用 Tabs 或分段式布局组织功能
- **签到功能**：
  - 微信扫码签到（调用微信浏览器 JS-SDK）
  - 如有必要，下载微信浏览器 SDK
  - 参考：[微信 JS-SDK 文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)

### 签到功能实现规范

**微信扫码签到（推荐）**

学生端主要通过微信浏览器访问，签到功能使用微信扫码：

1. **安装微信 JS-SDK**：
   ```bash
   pnpm add weixin-js-sdk
   ```

2. **配置微信 SDK**：
   ```typescript
   // src/core/utils/wechat.ts
   import wx from 'weixin-js-sdk'

   export function initWeChatConfig(config: {
     appId: string
     timestamp: number
     nonceStr: string
     signature: string
   }) {
     wx.config({
       debug: false,
       appId: config.appId,
       timestamp: config.timestamp,
       nonceStr: config.nonceStr,
       signature: config.signature,
       jsApiList: ['scanQRCode']
     })
   }

   export function scanQRCode() {
     return new Promise((resolve, reject) => {
       wx.scanQRCode({
         needResult: 1, // 1 表示需要返回结果
         scanType: ['qrCode', 'barCode'],
         success: (res) => resolve(res.resultStr),
         fail: (err) => reject(err)
       })
     })
   }
   ```

3. **使用扫码签到**：
   ```vue
   <script setup lang="ts">
   import { scanQRCode } from '@/core/utils/wechat'

   const handleScan = async () => {
     try {
       const result = await scanQRCode()
       // 处理签到逻辑
       await submitAttendance(result)
     } catch (error) {
       toast.error('扫码失败')
     }
   }
   </script>
   ```

**备用方案：手动输入签到码**

如果微信扫码不可用（如非微信浏览器），提供手动输入签到码的输入框。

### 移动端布局规范

**底部导航栏**：

学生端底部导航固定显示，但只包含**核心入口**：
- 🏠 首页（课程列表）
- 📚 我的课程
- 👤 个人中心

**导航不包含**：
- ❌ 独立的签到入口（签到在实验详情页内）
- ❌ 独立的实验入口（实验在课程详情页内）
- ❌ 独立的成绩入口（成绩在实验详情页或个人中心）

### 页面组件组织规范

**目录结构**：
```
src/features/student/courses/
├── components/
│   ├── CourseList.vue           # 课程列表（首页）
│   ├── CourseCard.vue           # 课程卡片
│   ├── ExperimentList.vue       # 实验列表（课程详情页）
│   ├── ExperimentCard.vue       # 实验卡片
│   └── ExperimentDetail.vue     # 实验详情（功能聚合页）
│       ├── AttendanceTab.vue    # 签到标签页
│       ├── StepsTab.vue         # 实验步骤标签页
│       └── SubmissionTab.vue    # 提交标签页
├── hooks/
│   ├── useQueryCourses.ts       # 查询课程列表
│   ├── useQueryExperiments.ts   # 查询实验列表
│   └── useScanAttendance.ts     # 扫码签到
└── utils/
    └── wechat.ts                # 微信 SDK 工具
```

### 交互流程示例

**学生完整操作流程**：
1. 打开应用 → 看到课程列表
2. 点击某个课程 → 看到该课程的实验列表
3. 点击某个实验 → 看到实验详情（包含签到、步骤、提交）
4. 点击"扫码签到" → 调用微信扫码 → 完成签到
5. 查看实验步骤 → 完成实验 → 提交结果

**理由**：
- **符合用户心智模型**：课程 → 实验 → 功能，自然层级
- **上下文清晰**：用户始终知道自己在哪里，在做什么课程/实验
- **减少导航跳转**：相关功能聚合在同一页面，不需要来回切换
- **移动端友好**：层级式导航更适合移动端的单手操作
- **微信生态适配**：扫码签到利用微信原生能力，体验更好

### 迁移指南

**当前架构问题**：
- ❌ 签到、实验、成绩等平铺为独立模块
- ❌ 缺少课程层级，无法区分不同课程的数据
- ❌ 底部导航包含太多入口，不符合层级式设计

**迁移步骤**：
1. ✅ 创建课程详情页 `/student/courses/[courseId]/index.vue`
2. ✅ 创建实验详情页 `/student/courses/[courseId]/experiments/[experimentId].page.vue`
3. ✅ 将签到功能集成到实验详情页内
4. ✅ 简化底部导航，只保留核心入口
5. ✅ 实现微信扫码签到功能
6. ❌ 删除独立的签到页面（`/student/attendance`）
7. ❌ 删除独立的实验页面（`/student/experiments`）

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

### 类型定义规范（CRITICAL）

**核心原则：基于自动生成的 API 类型派生，避免重复定义**

项目使用 OpenAPI 自动生成 API 类型（`@/core/api/generated`），所有业务类型应通过类型运算从这些 API 类型派生。

**类型层次结构**：
```
src/
├── core/api/generated/    # 自动生成的 API 类型（单一数据源）
│   └── types.gen.ts       # ← 所有类型定义的源头
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

**类型定义黄金法则**：
1. ✅ **使用类型别名**：`export type ClassEntity = Class`
2. ✅ **使用工具类型**：`export type ClassFormData = Partial<CreateClassRequest>`
3. ✅ **从 API 类型导入**：`import type { Class, CreateClassRequest } from '@/core/api/generated'`
4. ✅ **优先使用 satisfies**：保留精确类型推断，防止访问未定义属性
5. ❌ **禁止重复定义**：不要手动写与 API 类型相同的接口
6. ❌ **禁止手动定义 Schema**：不要自己写 JSON Schema，使用 API 类型

**satisfies vs 泛型断言**：
```typescript
// ✅ satisfies - 保留精确类型推断 + 严格的属性访问检查
type FormData = Partial<CreateRequest>
const formData = reactive({
  courseName: '',  // 类型推断为 string literal ""
}) satisfies FormData

// 访问未定义的属性会报错（防止误访问）
formData.courseId  // TypeScript Error: Property 'courseId' does not exist

// ❌ 泛型断言 - 类型 widening + 宽松的属性访问
const formData = reactive<Partial<CreateRequest>>({
  courseName: '',  // 类型被 widening 为 string
})

// 可以访问类型中的所有属性（即使未定义）
formData.courseId  // 不报错，类型为 string | undefined
```

**类型运算工具**：
- `Partial<T>` - 所有字段变为可选
- `Required<T>` - 所有字段变为必需
- `Pick<T, K>` - 选择部分字段
- `Omit<T, K>` - 排除部分字段
- **`satisfies`** - 验证类型同时保留精确推断（**优先使用**）

**理由**：
- 单一数据源：API 类型是唯一真实来源
- 避免重复：手动维护两份类型容易出错
- 自动同步：API 变更时自动反映到类型
- 减少维护：只需关注 API 类型定义
- 保留推断：satisfies 保留字面量的精确类型，提供更好的类型安全

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

**表单控件选择规范（CRITICAL）**

**PrimeVue v4 组件选择：Select vs Dropdown**

- ❌ **禁止使用带有 v-model 的 Dropdown**：PrimeVue v4 已弃用，使用 `Select` 组件代替
- ✅ **选择场景使用 Select**：需要绑定值的下拉选择（如选择班级、课程、实验等）
- ⚠️ **Dropdown 的正确使用场景**：仅用于不绑定值的操作菜单（如操作按钮下拉）

**适用场景**：
- 外键关联（如：班级ID、学生ID、课程ID）→ 使用 **Select**
- 枚举值选择（如：状态码、类型码）→ 使用 **Select**
- 固定选项的编号（如：学期编号、实验编号）→ 使用 **Select**
- 操作菜单（不绑定值，如"导出"、"删除"等操作）→ 使用 **Dropdown**

**示例**：
```vue
<!-- ✅ 正确：选择场景使用 Select 组件 -->
<Select
  v-model="formData.classId"
  :options="classOptions"
  option-label="className"
  option-value="classId"
  placeholder="请选择班级"
/>

<!-- ✅ 正确：操作菜单使用 Dropdown 组件 -->
<Dropdown>
  <template #default>
    <button>操作</button>
  </template>
  <template #content>
    <button @click="exportData">导出</button>
    <button @click="deleteItem">删除</button>
  </template>
</Dropdown>

<!-- ❌ 错误：使用 Dropdown 进行值绑定 -->
<Dropdown
  v-model="formData.classId"
  :options="classOptions"
  option-label="className"
  option-value="classId"
  placeholder="请选择班级"
/>
```

**数据准备**：
```typescript
// 准备下拉选项数据
const classOptions = computed(() => {
  return classes.value.map(item => ({
    className: item.name,
    classId: item.id,
  }))
})
```

**Tabs 组件使用规范（CRITICAL）**

**PrimeVue v4：使用 Tabs 替代已弃用的 TabView**

- ❌ **禁止使用 TabView**：PrimeVue v4 已弃用 `TabView` 组件
- ✅ **使用 Tabs 组件**：PrimeVue v4 的新 API 结构
- ✅ **正确的组件结构**：`Tabs` → `TabList` + `Tab` + `TabPanels` + `TabPanel`

**正确的使用方式**：
```vue
<!-- ✅ 正确：使用 PrimeVue v4 的 Tabs 组件 -->
<Tabs v-model:value="activeTab">
  <TabList>
    <Tab value="tab1">标签页 1</Tab>
    <Tab value="tab2">标签页 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="tab1">内容 1</TabPanel>
    <TabPanel value="tab2">内容 2</TabPanel>
  </TabPanels>
</Tabs>

<script setup lang="ts">
import { ref } from 'vue'
// 使用字符串值而不是数字索引
const activeTab = ref('tab1')
</script>
```

**关键变化**：
1. **组件名称**：`TabView` → `Tabs`
2. **结构变化**：需要使用 `TabList` + `Tab` + `TabPanels` + `TabPanel`
3. **属性变化**：
   - `v-model:active-index` → `v-model:value`
   - `header` 属性 → `<Tab>` 组件的子节点
   - Tab value 从数字索引改为字符串值

### 样式规范（CRITICAL）

**禁止使用 `<style>` 标签**

- ❌ **禁止在 `.vue` 文件中使用 `<style>` 标签**
- ✅ **只允许使用 TailwindCSS 修改样式**
- ✅ **使用 PrimeVue 组件的内置样式属性**：`class`, `pt`（pass through）等

**样式编写规则**：
1. **使用 TailwindCSS 工具类**
2. **使用 PrimeVue 组件的样式属性**：`class`, `pt` 等
3. **动态样式**：使用动态 class 绑定

**理由**：
- 统一样式系统，避免样式冲突
- 提高代码可维护性
- 减小打包体积
- 保持项目风格一致性

**例外情况**：
- 如确实需要自定义 CSS，应在全局样式文件中定义（需经团队讨论批准）
- 第三方组件库的样式覆盖除外

### Vue 组件规范（CRITICAL）

**使用 `defineModel()` 实现双向绑定（CRITICAL）**

**核心原则**：组件的双向绑定状态必须使用 `defineModel()`，禁止使用 `props + emit` 模式

- ✅ **使用 `defineModel()`**：无需手动定义 props 和 emits
- ❌ **禁止重复定义**：使用 `defineModel()` 时不要定义相应的 prop 和 emit
- ❌ **禁止使用 computed + emit**：不要用 computed 包装 props 来实现双向绑定

**标准用法**：

```typescript
// ✅ 正确：使用 defineModel()
const visible = defineModel<boolean>()
// 直接修改即可
visible.value = false

// ❌ 错误：不要这样写
interface Props {
  modelValue: boolean
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
visible.value = false  // ❌ 通过 computed 修改
```

**多个双向绑定值**：

当组件需要多个双向绑定值时，使用命名参数：

```typescript
// ✅ 正确：使用命名的 defineModel
const correctAnswer = defineModel<string>('modelValue', { required: true })
const selectedChoices = defineModel<string[]>('selectedChoices', { default: () => [] })

// ❌ 错误：不要这样写
interface Props {
  modelValue: string
  selectedChoices: string[]
}
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:selectedChoices', value: string[]): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
```

**对象类型的双向绑定**：

```typescript
// ✅ 正确：对象类型使用 defineModel
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>
const filters = defineModel<VideoFilters>({
  required: true,
  default: () => ({ originalFileName: undefined }),
})

// 使用
filters.value.originalFileName = 'new value'

// ❌ 错误：不要用 props + computed
interface Props {
  modelValue: VideoFilters
}
interface Emits {
  (e: 'update:modelValue', value: VideoFilters): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
```

**适用场景**：

- ✅ **表单输入组件**：Input、Select、Checkbox 等
- ✅ **筛选器组件**：Filter、Search 等
- ✅ **可配置的 UI 组件**：需要外部控制状态的组件
- ✅ **组件库封装**：对第三方组件进行二次封装

**不适用场景**：

- ❌ **对话框状态管理**：对话框的显示/隐藏应该封装在组件内部，使用 `defineExpose` 暴露方法
- ❌ **需要复杂联动**：双向绑定值的修改需要触发多个副作用
- ❌ **状态需要验证**：修改前需要复杂验证的场景

**旧代码迁移检查清单**：

当你发现组件包含以下代码时，应该迁移到 `defineModel()`：

1. ❌ 包含 `interface Props` 和 `interface Emits`
2. ❌ Props 中有 `modelValue` 或其他 `xxxValue` 字段
3. ❌ Emits 中有 `update:modelValue` 或 `update:xxxValue`
4. ❌ 使用 `computed` 包装 props 来实现双向绑定

**迁移步骤**：

```typescript
// ❌ 旧代码
interface Props {
  modelValue: boolean
  classCode: string
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// ✅ 新代码
interface Props {
  classCode: string
}
interface Emits {
  (e: 'refresh'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const visible = defineModel<boolean>()
```

**项目执行情况**：

以下组件已迁移到 `defineModel()` 规范：

1. ✅ `src/features/teacher/class/components/StudentListDialog.vue`
2. ✅ `src/features/teacher/course/components/CourseFormDialog.vue`
3. ✅ `src/features/teacher/video/components/VideoFilter.vue`
4. ✅ `src/features/teacher/topic/components/TopicFilter.vue`
5. ✅ `src/features/teacher/topic/components/TopicAnswerInput.vue`

**检查命令**：

```bash
# 检查项目中所有使用 update:modelValue 的组件
grep -r "update:modelValue" --include="*.vue" src/

# 检查项目中所有使用 Props + Emits 模式的组件
grep -r "interface Props" --include="*.vue" src/ | grep -v "defineModel"
```

**对话框状态管理规范（CRITICAL）**

**原则：状态封装在组件内部，通过 defineExpose 暴露操作方法**

- ✅ **对话框状态定义在组件内部**：不涉及组件间共享的状态应该封装在组件内部
- ✅ **通过 defineExpose 暴露方法**：只暴露 `open()`、`close()` 等操作方法
- ✅ **父组件通过 ref 调用**：使用 `dialogRef.value?.open()` 调用
- ❌ **禁止在父组件管理对话框状态**：不要在父组件定义 `showDialog` 等状态
- ❌ **禁止使用 v-model:visible**：不要通过 props 控制对话框显示

**适用场景**：
- ✅ 对话框状态、抽屉状态、表单状态、局部 UI 状态

**例外场景**（需要在外部管理状态）：
- ✅ 跨组件共享状态
- ✅ 需要响应状态变化
- ✅ 复杂联动

**标准实现模式**：

```vue
<!-- DialogComponent.vue -->
<template>
  <Dialog v-model:visible="visible" header="标题">
    <!-- 对话框内容 -->
  </Dialog>
</template>

<script setup lang="ts">
// 1. 对话框状态定义在组件内部
const visible = ref(false)

// 2. 定义 open 方法的参数类型
interface OpenOptions {
  id: number
  name: string
  // ... 其他配置参数
}

// 3. 实现 open 方法
function open(options: OpenOptions) {
  // 使用传入的参数进行初始化
  visible.value = true
}

// 4. 暴露 open 方法
defineExpose({ open })
</script>
```

**父组件调用方式**：

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <Button label="打开对话框" @click="handleOpen" />
    <DialogComponent ref="dialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DialogComponent from './DialogComponent.vue'

const dialogRef = ref<InstanceType<typeof DialogComponent>>()

const handleOpen = () => {
  // 通过 ref 调用 open 方法
  dialogRef.value?.open({
    id: 1,
    name: 'Example'
  })
}
</script>
```

**组件数据获取规范（CRITICAL）**

**原则：组件内部调用 hook 获取数据，利用 Vue Query 缓存机制，不通过 props 传递数据**

- ✅ **组件内部直接调用 hook**：数据获取逻辑封装在组件内部
- ✅ **利用 Vue Query 缓存**：相同 queryKey 的请求会自动共享缓存
- ✅ **Props 只用于配置参数**：props 用于传递配置项，不传递数据
- ✅ **Emits 只用于事件通知**：emit 用于通知父组件用户交互
- ❌ **禁止通过 props 传递数据**：不要将 topics、isLoading、total 等数据通过 props 传递

**规范总结**：
1. **数据获取**：组件内部调用 hook，利用 Vue Query 缓存
2. **Props 用途**：只用于配置参数（如 id、mode、options）
3. **Emits 用途**：只用于事件通知（如 click、submit、cancel）
4. **组件独立性**：组件应该能够独立工作，不依赖父组件传递数据

**例外场景**（需要通过 props 传递数据）：
- ✅ 静态数据展示：数据不会变化，且与后端无关
- ✅ 已加载的数据：父组件已经获取的数据，子组件直接使用
- ✅ 复合组件：子组件是纯 UI 组件，不应该包含数据逻辑

### 表格组件设计规范（CRITICAL）

**原则：表格组件内部调用 hook 获取数据和执行操作，简化组件使用方式**

- ✅ **表格内部调用查询 hook**：数据获取逻辑封装在表格组件内部
- ✅ **表格内部调用 mutation hook**：增删改操作逻辑封装在表格组件内部
- ✅ **通过 slot 传递 header**：使用 header slot 让页面自定义标题和操作按钮
- ✅ **通过 emit 通知页面**：只在需要页面级联动时使用 emit（如打开对话框）
- ❌ **禁止通过 props 传递数据**：不要将 items、isLoading、total、isDeleting 等数据通过 props 传递
- ❌ **禁止在页面中处理操作**：删除、编辑等操作应该在表格组件内部处理

**标准实现模式**：

```vue
<!-- VideoTable.vue -->
<template>
  <Card>
    <template #content>
      <DataTable
        :value="videos"
        :loading="query.isLoading.value"
        :paginator="true"
        :rows="size"
        :total-records="total"
        :lazy="true"
        @page="onPageChange"
        :pt="{ header: { class: 'px-0!' } }"
      >
        <template #header>
          <slot name="header" />
        </template>

        <!-- 列定义 -->
        <Column field="id" header="ID" />
        <Column header="操作">
          <template #body="slotProps">
            <Button @click="handleView(slotProps.data)" />
            <Button @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import type { VideoUploadResponse } from '@/core/api/generated'
import { useQueryVideoPage, useDeleteVideo } from '../hooks'

// ✅ 表格内部调用 hook 获取数据
const { current, size, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 10,
})

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteVideo()
const confirm = useConfirm()

// ✅ 分页逻辑封装在组件内部
const onPageChange = (event: any) => {
  current.value = event.page + 1
}

// ✅ 删除逻辑封装在组件内部
const handleDelete = (video: VideoUploadResponse) => {
  confirm.require({
    message: `确定要删除视频「${video.originalFileName}」吗？`,
    accept: async () => {
      await deleteMutation.mutateAsync(video.id!)
      query.refetch()
    },
  })
}

// ✅ 需要页面处理的事件通过 emit 通知
const emit = defineEmits<{
  (e: 'view', video: VideoUploadResponse): void
}>()

const handleView = (video: VideoUploadResponse) => {
  emit('view', video)
}
</script>
```

**页面使用方式**：

```vue
<!-- videos/index.page.vue -->
<template>
  <div class="p-1">
    <!-- ✅ 极简使用，不需要传递任何数据 props -->
    <VideoTable @view="handleView" @play="handlePlay">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">视频管理</h1>
          <Button label="上传视频" icon="pi pi-upload" @click="handleUploadClick" />
        </div>
      </template>
    </VideoTable>

    <!-- 对话框 -->
    <VideoDetailDialog ref="detailDialogRef" />
    <VideoPlayDialog ref="playDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoTable, VideoDetailDialog, VideoPlayDialog } from '@/features/teacher/video'
import type { VideoUploadResponse } from '@/core/api/generated'

// ✅ 页面只需要处理需要联动的事件
const detailDialogRef = ref<InstanceType<typeof VideoDetailDialog>>()
const playDialogRef = ref<InstanceType<typeof VideoPlayDialog>>()

const handleView = (video: VideoUploadResponse) => {
  detailDialogRef.value?.open(video)
}

const handlePlay = (video: VideoUploadResponse) => {
  playDialogRef.value?.open(video.id!)
}

const handleUploadClick = () => {
  // 打开上传对话框
}
</script>
```

**对比旧模式**：

```vue
<!-- ❌ 旧模式：需要传递大量 props -->
<VideoTable
  :videos="videos"
  :is-loading="query.isLoading.value"
  :total="total"
  :is-deleting="deleteMutation.isPending.value"
  @page="onPage"
  @view="handleView"
  @play="handlePlay"
  @delete="handleDelete"
/>

<script setup lang="ts">
// ❌ 页面需要管理大量状态和逻辑
const { current, size, videos, total, query } = useQueryVideoPage({ current: 1, size: 10 })
const deleteMutation = useDeleteVideo()

const onPage = (event: any) => {
  current.value = event.page + 1
}

const handleDelete = (video: VideoUploadResponse) => {
  confirm.require({
    message: `确定要删除视频「${video.originalFileName}」吗？`,
    accept: async () => {
      await deleteMutation.mutateAsync(video.id!)
      query.refetch()
    },
  })
}
</script>
```

**优势**：
1. **简化使用**：页面组件不需要传递大量 props
2. **逻辑内聚**：数据获取、分页、删除等逻辑都在表格组件内部
3. **易于维护**：修改表格逻辑不需要修改页面组件
4. **复用性强**：表格组件可以在多个页面中复用，无需重复编写逻辑
5. **类型安全**：Vue Query 自动处理缓存和状态管理

**工具函数组织规范（CRITICAL）**

**原则：工具函数必须提取到 utils 目录，禁止在组件内部定义**

- ✅ **工具函数放在 utils 目录**：所有可复用的工具函数必须放在 feature 的 utils 目录下
- ✅ **统一导出**：通过 utils/index.ts 或具体文件导出
- ✅ **纯函数优先**：工具函数应该是纯函数，便于测试和复用
- ❌ **禁止在组件内部定义工具函数**：不要在 .vue 文件的 script 中定义 formatDateTime 等函数
- ❌ **禁止重复定义**：多个组件中不要重复定义相同的工具函数

**目录结构**：
```
src/features/{module}/{entity}/
├── utils/
│   ├── formatters.ts    # 格式化函数
│   ├── validators.ts    # 验证函数
│   ├── helpers.ts       # 辅助函数
│   └── index.ts         # 统一导出
├── components/
└── hooks/
```

**工具函数分类**：

1. **格式化函数（formatters.ts）**：
   - `formatDateTime()` - 格式化日期时间
   - `formatDuration()` - 格式化时长
   - `formatFileSize()` - 格式化文件大小
   - `formatNumber()` - 格式化数字

2. **验证函数（validators.ts）**：
   - `validateEmail()` - 验证邮箱格式
   - `validatePhone()` - 验证手机号
   - `validateUrl()` - 验证 URL 格式

3. **辅助函数（helpers.ts）**：
   - `downloadFile()` - 下载文件
   - `copyToClipboard()` - 复制到剪贴板
   - `debounce()` - 防抖函数
   - `throttle()` - 节流函数

**常量和选项数据组织规范（CRITICAL）**

**原则：常量、枚举选项、配置数据必须提取到 constants 目录，禁止在组件内部定义**

- ✅ **常量放在 constants 目录**：所有常量、枚举选项、配置数据必须放在 feature 的 constants 目录下
- ✅ **按功能分类**：按模块或功能分类到不同的常量文件
- ✅ **统一导出**：通过 constants/index.ts 统一导出
- ✅ **使用 TypeScript 类型**：为选项数据定义明确的类型
- ✅ **避免魔法数字**：使用有意义的常量名代替数字
- ❌ **禁止在组件内部定义常量**：不要在 .vue 文件中定义 typeOptions、statusOptions 等

**目录结构**：
```
src/features/{module}/{entity}/
├── constants/
│   ├── index.ts         # 统一导出
│   ├── types.ts         # 类型选项、枚举
│   ├── status.ts        # 状态常量
│   ├── messages.ts      # 提示信息
│   └── config.ts        # 配置参数
├── components/
├── hooks/
└── utils/
```

**常量分类**：

1. **类型常量（types.ts）**：
   - 枚举选项（单选、多选、判断等）
   - 类型映射
   - 类型相关的配置
   - Magic Number 替换

2. **状态常量（status.ts）**：
   - 审核状态（待审核、已通过、已拒绝）
   - 启用状态（启用、禁用）
   - 状态文本映射函数

3. **消息常量（messages.ts）**：
   - 成功提示信息
   - 错误提示信息
   - 确认对话框文本

4. **配置常量（config.ts）**：
   - 分页配置（默认页码、默认每页条数）
   - 上传配置（文件大小限制、允许的文件类型）
   - 表单配置（最大长度、最小值等）

**命名规范**：
- ✅ **枚举对象**：使用 UPPER_SNAKE_CASE，如 `TOPIC_TYPE`、`REVIEW_STATUS`
- ✅ **选项数组**：使用 XXX_OPTIONS，如 `TOPIC_TYPE_OPTIONS`、`STATUS_OPTIONS`
- ✅ **常量值**：使用 UPPER_SNAKE_CASE，如 `SINGLE_CHOICE`、`PENDING`
- ✅ **类型导出**：使用 PascalCase，如 `TopicType`、`ReviewStatus`

**Magic Number 处理**：

Magic Number 是指代码中直接出现的、没有明确含义的数字。这些数字应该提取为常量：

```typescript
// ✅ constants/types.ts
/**
 * 选项标签 ASCII 码起始值（A = 65）
 * 用于生成 A, B, C, D... 选项标签
 */
export const CHOICE_LABEL_START_CHAR_CODE = 65
```

**常见的 Magic Number 示例**：
- ASCII 码起始值（`65` - 'A'）
- 数组索引边界（`0`, `1`）
- 特殊状态值（`-1`, `0`, `1`）
- 时间转换常量（`1000`, `3600`, `86400`）

### Hook 封装规范（CRITICAL）

**禁止组件直接调用 API，必须封装在 hook 中**

- ❌ **禁止组件直接导入并调用 API 函数**：不要在组件中 `import { postApiXXX } from '@/core/api/generated'` 并直接调用
- ✅ **所有 API 调用必须封装在 hook 中**：查询用 `useQuery`，变更用 `useMutation`
- ✅ **组件只调用 hook**：组件通过 `useXXX()` 使用封装好的 hook

**错误示例**：
```vue
<!-- ❌ 错误：组件直接调用 API -->
<script setup lang="ts">
import { getApiTestExcelTemplateUsers } from "@/core/api/generated"
import client from "@/core/api/config"

async function downloadTemplate() {
  const response = await getApiTestExcelTemplateUsers({ client })
  // 处理响应...
}
</script>
```

**正确示例**：
```vue
<!-- ✅ 正确：使用封装好的 hook -->
<script setup lang="ts">
import { useDownloadExcelTemplate } from "../hooks/useQueryExcelTemplate"

const downloadTemplateMutation = useDownloadExcelTemplate()

function downloadTemplate() {
  downloadTemplateMutation.mutate()
}
</script>
```

**Hook 封装示例**：
```typescript
// hooks/useQueryExcelTemplate.ts
import { getApiTestExcelTemplateUsers } from "@/core/api/generated"
import { useMutation } from "@tanstack/vue-query"
import client from "@/core/api/config"
import { toast } from "@/core/utils/toast"

export function useDownloadExcelTemplate() {
  return useMutation({
    mutationFn: async () => {
      const response = await getApiTestExcelTemplateUsers({ client })
      return response.data
    },
    onSuccess: (data) => {
      // 处理成功逻辑
      toast.success("下载成功")
    },
  })
}
```

**理由**：
- **统一错误处理**：Hook 中的 mutation/query 自动利用全局拦截器处理错误
- **状态管理**：Hook 自动管理 loading、error 状态，组件无需手动管理
- **代码复用**：Hook 可在多个组件中复用，避免重复代码
- **关注点分离**：组件只负责 UI，Hook 负责业务逻辑
- **易于测试**：Hook 可以独立测试，不需要挂载组件

---

**调用生成的 API 时必须传入 config.ts 的 client**

- ✅ **必须导入并传入 client**：从 `@/core/api/config` 导入 client 并传给 API
- ❌ **禁止使用默认 client**：不传 client 会绕过拦截器，导致认证和错误处理失效

```typescript
// ✅ 正确：导入并传入 client
import { postApiTeacherClassQuery } from "@/core/api/generated"
import client from "@/core/api/config"

export function useQueryClass() {
  return useQuery({
    queryFn: () =>
      postApiTeacherClassQuery({
        body: { pageable: false },
        client,  // ✅ 必须传入自定义 client
      }),
  })
}
```

**为什么必须传入自定义 client**：
config.ts 中创建的 client 包含了关键的 axios 拦截器：
1. **请求拦截器**：自动添加 `Authorization: Bearer ${token}` 认证头
2. **响应拦截器**：
   - 处理 401 未授权错误，自动跳转登录页
   - 统一处理业务错误码（code !== 200）
   - 自动显示 Toast 错误提示

**不传 client 的后果**：
- ❌ 无法自动添加 token，导致 401 错误
- ❌ 401 错误不会自动跳转登录
- ❌ 业务错误码不会统一处理
- ❌ 错误不会自动显示 Toast

**useQuery 必须添加 select 字段提取数据**

- ✅ **必须添加 select 字段**：当 API 返回 JSON 数据时，使用 `select` 提取实际数据
- ✅ **标准格式**：`select: (response) => response.data?.data`
- ❌ **禁止直接返回完整响应**：不要返回包含 `data` 包装的完整响应

**API 返回格式**：
后端 API 通常返回如下格式：
```typescript
{
  data: {
    data: T[],        // 实际数据数组或对象
    total?: number    // 分页总数
  },
  code: number,
  message: string
}
```

**Hook 必须封装页面级状态（CRITICAL）**

**原则：筛选条件、分页参数等页面级响应式状态必须定义在 hook 内部，通过 return 暴露给页面组件使用**

- ✅ **页面级状态定义在 hook 中**：筛选条件（filters）、分页参数（current、size）等必须定义在 hook 内部
- ✅ **通过 return 暴露状态和方法**：hook 返回状态 ref 和修改方法，页面组件通过解构使用
- ❌ **禁止在页面组件中定义状态**：不要在页面组件中直接 `ref()` 定义这些状态
- ❌ **禁止在 hook 中使用 reactive**：统一使用 ref，保持一致性

**规范总结**：
1. **Hook 封装**：所有页面级的响应式状态必须在 hook 内部定义
2. **返回暴露**：通过 return 语句返回状态 ref，页面组件通过解构使用
3. **统一 ref**：使用 ref 而不是 reactive，保持一致性
4. **页面简化**：页面组件只保留事件处理逻辑，不定义状态

**Hook onSuccess 中的数据校验规范（CRITICAL）**

**原则：数据解析、校验、转换必须在 hook 的 onSuccess/onSettled 中处理，组件只接收最终结果**

- ✅ **在 hook 的 onSuccess 中处理数据**：解析、校验、类型守卫、toast 提示
- ❌ **禁止在组件中解析 API 响应**：不要在组件中写 JSON.parse 或数据校验
- ❌ **禁止在组件中手动调用 toast**：成功提示应该在 hook 的 onSuccess 中

**错误示例**：
```vue
<!-- ❌ 错误：组件中解析数据 -->
<script setup lang="ts">
const response = await importMutation.mutateAsync(file)
const parsed = JSON.parse(response.data)  // ❌ 数据解析在组件中
if (parsed.successCount) {
  toast.add({ severity: 'success', detail: `成功 ${parsed.successCount} 条` })  // ❌ toast 在组件中
}
</script>
```

**正确示例**：
```typescript
// ✅ 正确：hook 中处理所有逻辑
export function useImportStudentsByExcel() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await postApiTestExcelImportUsers({
        body: { file },
        client,
      })
      return response.data
    },
    onSuccess: (data) => {
      // ✅ 数据解析、校验在 hook 的 onSuccess 中
      const result = parseImportResponse(data)

      // ✅ toast 提示在 hook 中
      if (result.message) {
        toast.success(result.message)
      }

      return result  // 返回处理后的结果
    },
  })
}
```

**组件使用**：
```vue
<!-- ✅ 正确：组件只调用 hook -->
<script setup lang="ts">
const importMutation = useImportStudentsByExcel()

async function handleImport() {
  await importMutation.mutateAsync(file)
  // hook 的 onSuccess 已经处理了所有逻辑
  // 组件只需要处理 UI 相关逻辑
  emit('success')
  close()
}
</script>
```

**理由**：
- **职责分离**：Hook 处理业务逻辑，组件只负责 UI 交互
- **代码复用**：数据解析逻辑可以在多个组件中复用
- **类型安全**：Hook 中使用类型守卫，组件不需要关心数据格式
- **易于测试**：Hook 可以独立测试数据解析逻辑
- **一致性**：所有 API 调用的数据处理都在 hook 中

### 错误处理规范（CRITICAL）

**禁止使用 try-catch 包裹 mutation 调用处理错误**

项目已在 axios 拦截器中实现全局错误处理，会自动显示错误 Toast。

- ❌ **禁止使用 try-catch 包裹 mutation 并手动处理错误**
- ✅ **只需处理成功情况，让全局错误处理接管错误**

**示例**：
```typescript
// ❌ 错误：不必要的 try-catch
const handleDelete = async (id: number) => {
  try {
    await deleteMutation.mutateAsync({ path: { id } })
    toast.add({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 })
    query.refetch()
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '删除失败', life: 3000 })
  }
}

// ✅ 正确：只处理成功，错误由全局处理
const handleDelete = async (id: number) => {
  await deleteMutation.mutateAsync({ path: { id } })
  toast.add({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 })
  query.refetch()
}
```

**理由**：
- 全局错误处理已在 `src/core/api/config.ts` 的 axios 拦截器中实现
- 避免重复的错误处理代码
- 统一的错误提示风格
- 减少代码冗余

### 表单和列表设计规范（CRITICAL）

**严格依据后端 API 字段，禁止擅自添加或修改**

- ✅ **表单字段必须与 API 请求/响应类型一致**
- ✅ **列表列定义必须与 API 响应类型一致**
- ✅ **使用 satisfies 而不是泛型断言**
- ❌ **禁止添加后端 API 中不存在的字段**
- ❌ **擅自修改字段类型或名称**
- ❌ **增加冗余的类型定义**

**工作流程**：
1. **先查看 API 类型**：使用 `Go to Definition` 查看后端 API 定义的类型
2. **严格按类型设计**：表单字段、列表列必须与 API 类型一致
3. **使用类型运算**：通过 `Partial`、`Pick`、`Omit` 等工具类型派生，不要手动定义
4. **验证类型安全**：使用 `satisfies` 确保类型正确

**如果字段不够用**：
- ❌ 不要擅自添加字段
- ✅ 与后端沟通，先修改 API 定义
- ✅ 或使用前端的计算属性（不提交到后端）

**理由**：
- 避免运行时错误：擅自添加字段会导致请求失败或数据不显示
- 降低维护成本：API 变更时只需更新类型定义，不需要修改多处
- 保证类型安全：TypeScript 可以在编译时发现错误
- 提高开发效率：不需要在前后端类型之间做转换
- 单一数据源：API 类型是唯一真实来源

### 功能开发工作流（CRITICAL）

**标准三层架构：API → Feature → Page**

项目采用严格的分层架构，新功能开发必须按照以下顺序进行：

```
┌─────────────────────────────────────────────┐
│  1. API 层（自动生成）                        │
│     @/core/api/generated/                   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. Feature 层（业务逻辑封装）                 │
│     @/features/{module}/                     │
│     ├── hooks/        # 数据获取和提交       │
│     ├── components/   # UI 组件             │
│     ├── utils/        # 工具函数             │
│     └── index.ts      # 统一导出             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  3. Page 层（页面组装）                       │
│     @/pages/{module}/                       │
│     └── {page}.page.vue  # 只做组装，不写逻辑 │
└─────────────────────────────────────────────┘
```

**开发步骤（严格遵守顺序）**：

### 步骤 1：确认 API 已生成

在开始开发前，确保后端 API 已经生成到 `@/core/api/generated/`。

**如果 API 不存在**：
- ❌ **禁止使用 fetch/axios 手动调用 API**
- ✅ 先运行 API 生成脚本
- ✅ 或联系后端更新 OpenAPI 规范

### 步骤 2：创建 Feature Hooks（优先）

**路径**：`src/features/{module}/{entity}/hooks/`

**规则**：
- ✅ **必须使用自动生成的 API 函数**：从 `@/core/api/generated` 导入
- ✅ **必须传入自定义 client**：确保拦截器生效
- ✅ **Query 必须添加 select**：提取 `response.data?.data`
- ✅ **Mutation 使用全局 toast**：从 `@/core/utils/toast` 导入
- ❌ **禁止在页面组件中写 useQuery/useMutation**

**查询 Hook 模板**：
```typescript
import { postApiTeacherVideosQuery } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

export function useQueryVideoPage(params: { current: number; size: number }) {
  return useQuery({
    queryKey: ["videos", params.current, params.size],
    queryFn: () =>
      postApiTeacherVideosQuery({
        body: { current: params.current, size: params.size, pageable: true },
        client,  // ✅ 必须传入
      }),
    select: (response) => response.data?.data,  // ✅ 提取数据
  })
}
```

**变更 Hook 模板**：
```typescript
import { deleteApiTeacherVideosByVideoId } from "@/core/api/generated"
import client from "@/core/api/config"
import { useMutation } from "@tanstack/vue-query"
import { toast } from "@/core/utils/toast"

export function useDeleteVideo() {
  return useMutation({
    mutationFn: (videoId: number) =>
      deleteApiTeacherVideosByVideoId({
        path: { videoId },
        client,  // ✅ 必须传入
      }),
    onSuccess: () => {
      toast.success("视频删除成功")  // ✅ 使用全局 toast
    },
  })
}
```

### 步骤 3：创建 Feature 组件

**路径**：`src/features/{module}/{entity}/components/`

**规则**：
- ✅ 使用 `defineModel()` 实现双向绑定
- ✅ 使用 PrimeVue 组件
- ✅ 只使用 TailwindCSS（禁止 `<style>`）
- ✅ 组件内部逻辑通过 emit 传递给父组件

### 步骤 4：创建 Page 组件（最后）

**路径**：`src/pages/{module}/{page}.page.vue`

**规则**：
- ✅ **只做组件组装**：不写业务逻辑
- ✅ **使用 Feature Hooks**：从 `@/features/{module}/{entity}` 导入
- ✅ **使用 Feature 组件**：从 `@/features/{module}/{entity}` 导入
- ❌ **禁止直接调用 API**：必须使用 hooks
- ❌ **禁止定义 useQuery/useMutation**：必须在 hooks 中
- ❌ **禁止写复杂业务逻辑**：逻辑应该在 hooks 或组件中

**页面模板**：
```vue
<template>
  <div class="p-6">
    <VideoFilter v-model="filters" />
    <VideoTable
      :videos="videos"
      :is-loading="query.isLoading.value"
      @page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import { useQueryVideoPage, useDeleteVideo } from "@/features/teacher/video"
import { VideoFilter, VideoTable } from "@/features/teacher/video"

// ✅ 使用 hooks 管理状态
const { videos, query } = useQueryVideoPage({ current: 1, size: 10 })
const deleteMutation = useDeleteVideo()

// ✅ 只保留 UI 交互逻辑
const onPage = (event: any) => {
  // 处理分页
}
</script>
```

**理由**：
- **职责分离**：API 层、业务层、展示层各司其职
- **代码复用**：hooks 可在多个页面中复用
- **易于测试**：独立的 hooks 和组件更容易测试
- **维护性强**：修改 API 只需更新 hooks，不影响页面
- **类型安全**：自动生成的 API 类型确保类型正确
- **统一风格**：所有功能都按同样的结构组织
