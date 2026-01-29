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

在开始任何代码修改任务前，必须先���行 `pnpm typecheck` 确立当前的类型检查状态：

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

<!-- ❌ 错误：使用 InputNumber 让用户手动输入 ID -->
<InputNumber
  v-model="formData.classId"
  placeholder="请输入班级ID"
/>

<!-- ❌ 错误：使用 InputText 让用户手动输入代码 -->
<InputText
  v-model="formData.statusCode"
  placeholder="请输入状态码"
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

**理由**：
- **API 设计**：PrimeVue v4 将选择功能从 Dropdown 中分离，形成专门的 Select 组件
- **避免错误**：防止用户输入错误的 ID 或代码
- **提升体验**：用户可以看到可选选项，无需记忆
- **数据一致性**：确保只能选择已存在的有效数据
- **类型安全**：下拉选择可以保证类型安全
- **更好的可维护性**：选项集中管理，易于更新
- **符合规范**：遵循 PrimeVue v4 的组件设计理念

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
    <TabPanel value="tab1">
      内容 1
    </TabPanel>
    <TabPanel value="tab2">
      内容 2
    </TabPanel>
  </TabPanels>
</Tabs>

<script setup lang="ts">
import { ref } from 'vue'

// 使用字符串值而不是数字索引
const activeTab = ref('tab1')
</script>
```

**错误的使用方式**：
```vue
<!-- ❌ 错误：使用已弃用的 TabView -->
<TabView v-model:active-index="activeTab">
  <TabPanel header="标签页 1">
    内容 1
  </TabPanel>
  <TabPanel header="标签页 2">
    内容 2
  </TabPanel>
</TabView>

<script setup lang="ts">
import { ref } from 'vue'

// ❌ 旧 API 使用数字索引
const activeTab = ref(0)
</script>
```

**关键变化**：
1. **组件名称**：`TabView` → `Tabs`
2. **结构变化**：需要使用 `TabList` + `Tab` + `TabPanels` + `TabPanel`
3. **属性变化**：
   - `v-model:active-index` → `v-model:value`
   - `header` 属性 → `<Tab>` 组件的子节点
   - Tab value 从数字索引改为字符串值

**最佳实践**：
- ✅ 使用描述性的字符串作为 tab value（如 `'interactive'`, `'json'`）
- ✅ 为每个 tab 提供清晰的标签文本
- ✅ 保持 tab 内容的简洁和相关性
- ❌ 不要使用数字索引（如 0, 1, 2）作为 tab value

**理由**：
- **避免弃用警告**：TabView 在 PrimeVue v4 中已弃用，会产生警告
- **更好的类型安全**：字符串 value 比数字索引更具描述性和类型安全
- **更清晰的 API**：新的结构更明确，标签和内容分离
- **未来兼容性**：遵循最新的组件 API，避免未来版本升级问题
- **更好的可维护性**：新 API 更符合 Vue 3 的组合式 API 设计理念

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

### Vue 组件规范（CRITICAL）

**使用 `defineModel()` 实现双向绑定**

- ✅ **使用 `defineModel()`**：无需手动定义 props 和 emits
- ❌ **禁止重复定义**：使用 `defineModel()` 时不要定义相���的 prop 和 emit

**示例**：
```typescript
// ✅ 正确：使用 defineModel()
const visible = defineModel<boolean>()

// 直接修改即可
visible.value = false

// ❌ 错误：不要这样写
interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用时需要手动 emit
emit('update:visible', false)
```

**注意事项**：
- `defineModel()` 自动处理双向绑定，无需额外配置
- 直接修改返回的 ref 即可触发更新
- 如果有多个 v-model，可以传入参数：`defineModel<'visible' | 'value'>()`
- 注意函数引用顺序：使用 watch 时，被引用的函数必须先定义

**常见场景**：
- Dialog 的显示/隐藏
- 表单数据的双向绑定
- 任何需要父子组件同步的场景

**对话框状态管理规范（CRITICAL）**

**原则：状态封装在组件内部，通过 defineExpose 暴露操作方法**

- ✅ **对话框状态定义在组件内部**：不涉及组件间共享的状态应该封装在组件内部
- ✅ **通过 defineExpose 暴露方法**：只暴露 `open()`、`close()` 等操作方法
- ✅ **父组件通过 ref 调用**：使用 `dialogRef.value?.open()` 调用
- ❌ **禁止在父组件管理对话框状态**：不要在父组件定义 `showDialog` 等状态

**正确示例**：

```vue
<!-- VideoUploadDialog.vue -->
<template>
  <Dialog v-model:visible="visible" header="上传视频" modal>
    <!-- 对话框内容 -->
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ✅ 状态封装在组件内部
const visible = ref(false)
const formData = ref({
  title: '',
  description: '',
})

// ✅ 暴露操作方法
function open(data?: any) {
  if (data) {
    formData.value = data
  }
  visible.value = true
}

function close() {
  visible.value = false
}

// ✅ 只暴露方法，不暴露状态
defineExpose({
  open,
  close,
})
</script>
```

**父组件使用**：

```vue
<!-- VideoPage.vue -->
<template>
  <div>
    <Button label="上传" @click="handleUpload" />
    <VideoUploadDialog ref="uploadDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VideoUploadDialog from '@/features/teacher/video/components/VideoUploadDialog.vue'

// ✅ 只需要 ref，不需要管理状态
const uploadDialogRef = ref<InstanceType<typeof VideoUploadDialog>>()

// ✅ 通过方法调用，简洁明了
const handleUpload = () => {
  uploadDialogRef.value?.open()
}
</script>
```

**错误示例**：

```vue
<!-- ❌ 错误：在父组件管理对话框状态 -->
<script setup lang="ts">
import { ref } from 'vue'

// ❌ 父组件管理对话框状态，违反封装原则
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const showPlayDialog = ref(false)

const handleUpload = () => {
  showUploadDialog.value = true  // ❌ 状态管理分散
}
</script>
```

**适用场景**：
- ✅ **对话框状态**：不涉及跨组件共享的对话框显示/隐藏
- ✅ **抽屉状态**：Drawer 的显示/隐藏
- ✅ **表单状态**：表单的编辑/新增状态
- ✅ **局部UI状态**：只在组件内部使用的状态

**例外场景**（需要在外部管理状态）：
- ✅ **跨组件共享状态**：多个组件需要控制同一个对话框
- ✅ **需要响应状态变化**：父组件需要监听对话框状态变化
- ✅ **复杂联动**：对话框状态与其他状态有复杂联动

**最佳实践模板**：

```vue
<!-- FeatureDialog.vue -->
<template>
  <Dialog v-model:visible="visible" :header="title">
    <!-- 对话框内容 -->
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '对话框',
})

// 状态封装
const visible = ref(false)
const formData = ref({})

// 操作方法
function open(initialData?: any) {
  if (initialData) {
    formData.value = initialData
  }
  visible.value = true
}

function close() {
  visible.value = false
  formData.value = {}
}

// 只暴露方法
defineExpose({
  open,
  close,
})
</script>
```

**理由**：
- **封装性更好**：状态管理集中在组件内部
- **代码更简洁**：父组件不需要管理大量状态
- **易于维护**：修改状态逻辑只需要修改组件本身
- **复用性更强**：组件自包含，更容易复用
- **职责清晰**：父组件只负责触发，子组件负责管理

### 类型定义黄金法则（CRITICAL）

**禁止手动定义冗余接口，必须从 API 类型派生**

- ✅ **使用 API 类型 + 类型运算**：`type FormData = Partial<CreateRequest>`
- ✅ **优先使用 satisfies 而不是泛型断言**
- ❌ **禁止重复定义字段**：不要手动写与 API 类型相同的接口

**示例**：
```typescript
// ✅ 正确：从 API 类型派生 + satisfies
import type { CreateCourseRequest } from '@/core/api/generated'

type CourseFormData = Partial<CreateCourseRequest>

const formData = reactive({
  courseName: '',
}) satisfies CourseFormData

// ❌ 错误1：手动定义冗余接口
interface CourseFormData {
  courseId?: string
  courseName?: string
}

// ❌ 错误2：使用泛型断言（优先使用 satisfies）
const formData = reactive<CourseFormData>({
  courseName: '',
})
```

**satisfies vs 泛型断言**：
```typescript
// satisfies - 保留精确类型推断 + 严格的属性访问检查
const formData = reactive({
  courseName: '',  // 类型推断为 string literal ""
}) satisfies CourseFormData

// ❌ 访问未定义的属性会报错（防止误访问）
formData.courseId  // TypeScript Error: Property 'courseId' does not exist

// 泛型断言 - 类型 widening + 宽松的属性访问
const formData = reactive<CourseFormData>({
  courseName: '',  // 类型被 widening 为 string
})

// ✅ 可以访问类型中的所有属性（即使未定义）
formData.courseId  // 不报错，类型为 string | undefined
```

**重要区别**：
- `satisfies`：最终类型是对象字面量的实际类型，只能访问已定义的属性
- 泛型断言：最终类型是目标类型，可以访问类型中的所有属性（包括未定义的）

**为什么 satisfies 更好**：
- **防止错��**：访问未定义的属性会立即报错，捕获潜在 bug
- **精确推断**：保留字面量的精确类型
- **更安全**：强制只能使用实际定义的字段

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
- **保留推断**：satisfies 保留字面量的精确类型，提供更好的类型安全

### Hook 封装规范（CRITICAL）

**调用生成的 API 时必须传入 config.ts 的 client**

- ✅ **必须导入并传入 client**：从 `@/core/api/config` 导入 client 并传给 API
- ❌ **禁止使用默认 client**：不传 client 会绕过拦截器，导致认证和错误处理失效

**正确示例**：
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

// ✅ 正确：Mutation 也需要传入 client
import { deleteApiTeacherClassById } from "@/core/api/generated"
import client from "@/core/api/config"

export function useDeleteClass() {
  return useMutation({
    mutationFn: async (params) => {
      return await deleteApiTeacherClassById({
        ...params,
        client,  // ✅ 必须传入自定义 client
      })
    },
  })
}

// ❌ 错误：不传 client，使用默认 client
export function useQueryClassWrong() {
  return useQuery({
    queryFn: () =>
      postApiTeacherClassQuery({
        body: { pageable: false },
        // ❌ 缺少 client 参数
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
- ❌ 需要手动处理所有这些逻辑，增加维护成本

**规范总结**：
所有自定义 hooks 中调用生成的 API 时，必须：
```typescript
import client from "@/core/api/config"

// Query 或 Mutation 中
someApiFunction({
  ...params,
  client,  // ✅ 永远不要忘记
})
```

**useQuery 必须添加 select 字段提取数据**

- ✅ **必须添加 select 字段**：当 API 返回 JSON 数据时，使用 `select` 提取实际数据
- ✅ **标准格式**：`select: (response) => response.data?.data`
- ❌ **禁止直接返回完整响应**：不要返回包含 `data` 包装的完整响应

**正确示例**：
```typescript
// ✅ 正确：使用 select 提取数据
import { getApiTeacherClassQuery } from "@/core/api/generated"
import client from "@/core/api/config"

export function useQueryClass() {
  return useQuery({
    queryKey: ['class'],
    queryFn: () =>
      getApiTeacherClassQuery({
        query: { pageable: false },
        client,
      }),
    select: (response) => response.data?.data,  // ✅ 提取实际数据
  })
}

// ❌ 错误：没有 select，返回完整响应
export function useQueryClassWrong() {
  return useQuery({
    queryKey: ['class'],
    queryFn: () =>
      getApiTeacherClassQuery({
        query: { pageable: false },
        client,
      }),
    // ❌ 缺少 select，返回的是 { data: { data: [...] } }
  })
}
```

**使用场景**：
- ✅ 所有使用 `useQuery` 获取数据时
- ✅ API 返回格式为 `{ data: { data: ... } }` 时
- ✅ 需要在组件中直接使用实际数据而不是包装响应时

**理由**：
- **数据一致性**：统一的数据提取方式，避免组件中重复写 `response.data?.data`
- **类型安全**：select 会自动推断返回类型，提供更好的类型提示
- **代码简洁**：组件中直接使用 `data.value` 而不是 `data.value.data?.data`
- **易于维护**：数据提取逻辑集中在 hook 中，修改时只需改一处

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

使用 `select: (response) => response.data?.data` 提取后，组件中直接获得 `T[]` 或 `T` 类型。

**Hook 必须封装页面级状态（CRITICAL）**

**原则：筛选条件、分页参数等页面级响应式状态必须定义在 hook 内部，通过 return 暴露给页面组件使用**

- ✅ **页面级状态定义在 hook 中**：筛选条件（filters）、分页参数（current、size）等必须定义在 hook 内部
- ✅ **通过 return 暴露状态和方法**：hook 返回状态 ref 和修改方法，页面组件通过解构使用
- ❌ **禁止在页面组件中定义状态**：不要在页面组件中直接 `ref()` 定义这些状态
- ❌ **禁止在 hook 中使用 reactive**：统一使用 ref，保持一致性

**正确示例**：

```typescript
// ✅ 正确：hook 封装所有状态
// hooks/useQueryVideoPage.ts
import { ref } from "vue"
import { postApiTeacherVideosQuery } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

export function useQueryVideoPage(initialParams: { current: number; size: number }) {
  // ✅ 状态定义在 hook 内部
  const filters = ref<VideoFilters>({})
  const current = ref(initialParams.current)
  const size = ref(initialParams.size)
  const fileName = ref("")

  // ✅ 查询逻辑
  const query = useQuery({
    queryKey: ["videos", current, size, fileName],
    queryFn: () =>
      postApiTeacherVideosQuery({
        body: {
          current: current.value,
          size: size.value,
          originalFileName: fileName.value || undefined,
          pageable: true,
        },
        client,
      }),
    select: (response) => response.data?.data,
  })

  // ✅ 返回所有需要的状态和方法
  return {
    // 状态
    filters,
    current,
    size,
    fileName,
    videos: query.data,
    total: query.data?.total || 0,
    // Query 对象
    query,
  }
}
```

**页面组件使用**：

```vue
<!-- pages/teacher/videos/index.page.vue -->
<template>
  <div class="p-6">
    <VideoFilter v-model="filters" />
    <VideoTable
      :videos="videos"
      :is-loading="query.isLoading.value"
      :total="total"
      @page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import { useQueryVideoPage, useDeleteVideo } from "@/features/teacher/video"
import { VideoFilter, VideoTable } from "@/features/teacher/video"

// ✅ 从 hook 解构所有需要的状态
const { filters, current, size, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 10,
})

const deleteMutation = useDeleteVideo()

// ✅ 页面组件只保留事件处理逻辑
const onPage = (event: any) => {
  current.value = event.page + 1
}
</script>
```

**错误示例**：

```vue
<!-- ❌ 错误：在页面组件中定义状态 -->
<script setup lang="ts">
import { ref } from "vue"

// ❌ 页面组件不应该定义这些状态
const filters = ref<VideoFilters>({})
const current = ref(1)
const size = ref(10)
const fileName = ref("")

// ❌ hook 被迫接受外部状态
const { videos, query } = useQueryVideoPage(current, size, fileName)

const onPage = (event: any) => {
  current.value = event.page + 1  // ❌ 状态管理分散
}
</script>
```

```typescript
// ❌ 错误：hook 接受外部状态作为参数
export function useQueryVideoPage(
  current: Ref<number>,
  size: Ref<number>,
  fileName: Ref<string>
) {
  // ❌ 依赖外部传入的状态，破坏封装性
  const query = useQuery({
    queryKey: ["videos", current, size, fileName],
    queryFn: () => postApiTeacherVideosQuery({
      body: {
        current: current.value,
        size: size.value,
        originalFileName: fileName.value || undefined,
      },
      client,
    }),
  })

  return { videos: query.data }
}
```

**适用场景**：
- ✅ **筛选条件状态**：filters、searchParams 等查询条件
- ✅ **分页参数状态**：current、size、total 等分页相关状态
- ✅ **表单状态**：formData、validationErrors 等表单相关状态
- ✅ **UI 状态**：selectedRows、expandedKeys 等 UI 交互状态

**例外场景**（需要在外部管理状态）：
- ✅ **跨组件共享状态**：多个组件需要访问同一个状态（使用 Pinia store）
- ✅ **路由相关状态**：需要与路由参数同步的状态
- ✅ **临时局部状态**：仅在某个事件处理函数中使用的临时变量

**规范总结**：
1. **Hook 封装**：所有页面级的响应式状态必须在 hook 内部定义
2. **返回暴露**：通过 return 语句返回状态 ref，页面组件通过解构使用
3. **统一 ref**：使用 ref 而不是 reactive，保持一致性
4. **页面简化**：页面组件只保留事件处理逻辑，不定义状态

**理由**：
- **封装性**：状态管理逻辑集中在 hook 中，页面组件更简洁
- **可复用**：hook 可以在不同页面中复用，状态管理逻辑跟随 hook
- **可测试**：独立的 hook 更容易进行单元测试
- **职责清晰**：hook 负责状态管理，页面组件负责 UI 交互
- **易于维护**：修改状态逻辑只需要修改 hook，不影响页面组件

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
    await deleteMutation.mutateAsync({
      path: { id },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '删除成功',
      life: 3000,
    })
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '删除失败',
      life: 3000,
    })
  }
}

// ✅ 正确：只处理成功，错误由全局处理
const handleDelete = async (id: number) => {
  await deleteMutation.mutateAsync({
    path: { id },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '删除成功',
    life: 3000,
  })
  query.refetch()
}
```

**理由**：
- 全局错误处理已在 `src/core/api/config.ts` 的 axios 拦截器中实现
- 避免重复的错误处理代码
- 统一的错误提示风格
- 减少代码冗余

**适用场景**：
- ✅ Mutation 调用（创建、更新、删除）
- ✅ Query 调用（如有全局错误处理）
- ❌ 特殊场景需要自定义错误处理时除外（需注释说明原因）

### 表单和列表设计规范（CRITICAL）

**严格依据后端 API 字段，禁止擅自添加或修改**

- ✅ **表单字段必须与 API 请求/响应类型一致**
- ✅ **列表列定义必须与 API 响应类型一致**
- ❌ **禁止添加后端 API 中不存在的字段**
- ❌ **擅自修改字段类型或名称**
- ❌ **增加冗余的类型定义**

**表单设计原则**：
```typescript
// ✅ 正确：直接使用 API 类型
import type { CreateExperimentRequest } from '@/core/api/generated'

type ExperimentFormData = Partial<CreateExperimentRequest>

const formData = reactive({
  experimentName: '',
  description: '',
}) satisfies ExperimentFormData

// ❌ 错误：擅自添加后端没有的字段
const formData = reactive({
  experimentName: '',
  description: '',
  customField: '',  // 后端 API 没有这个字段！
  experimentDate: '',  // 后端不叫这个名字！
})
```

**列表设计原则**：
```typescript
// ✅ 正确：列定义与 API 响应类型一致
import type { ExperimentInfo } from '@/core/api/generated'

const columns: TableColumn<ExperimentInfo>[] = [
  { field: 'experimentName', header: '实验名称' },
  { field: 'description', header: '描述' },
  { field: 'createdAt', header: '创建时间' },
]

// ❌ 错误：擅自添加不存在的字段
const columns = [
  { field: 'experimentName', header: '实验名称' },
  { field: 'customField', header: '自定义字段' },  // API 中没有！
  { field: 'experimentDate', header: '实验日期' },  // 字段名不对！
]
```

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
- **避免运行时错误**：擅自添加字段会导致请求失败或数据不显示
- **降低维护成本**：API 变更时只需更新类型定义，不需要修改多处
- **保证类型安全**：TypeScript 可以在编译时发现错误
- **提高开发效率**：不需要在前后端类型之间做转换
- **单一数据源**：API 类型是唯一真实来源

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

在开始开发前，确保后端 API 已经生成到 `@/core/api/generated/`：

```bash
# 检查生成的 API 函数
grep "export.*function.*Api" /path/to/sdk.gen.ts | grep {moduleName}
```

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

**目录结构**：
```
src/features/teacher/video/hooks/
├── index.ts                   # 统一导出
├── useQueryVideo.ts          # 查询 hooks
└── useMutateVideo.ts         # 变更 hooks
```

**查询 Hook 模板**：
```typescript
// useQueryVideo.ts
import { postApiTeacherVideosQuery } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

export function useQueryVideoPage(params: { current: number; size: number }) {
  return useQuery({
    queryKey: ["videos", params.current, params.size],
    queryFn: () =>
      postApiTeacherVideosQuery({
        body: {
          current: params.current,
          size: params.size,
          pageable: true,
        },
        client,  // ✅ 必须传入
      }),
    select: (response) => response.data?.data,  // ✅ 提取数据
  })
}
```

**变更 Hook 模板**：
```typescript
// useMutateVideo.ts
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

**导出文件**：
```typescript
// index.ts
export * from "./useQueryVideo"
export * from "./useMutateVideo"
```

### 步骤 3：创建 Feature 组件

**路径**：`src/features/{module}/{entity}/components/`

**规则**：
- ✅ 使用 `defineModel()` 实现双向绑定
- ✅ 使用 PrimeVue 组件
- ✅ 只使用 TailwindCSS（禁止 `<style>`）
- ✅ 组件内部逻辑通过 emit 传递给父组件

**示例**：
```vue
<!-- VideoTable.vue -->
<template>
  <DataTable
    :value="videos"
    :loading="isLoading"
    @page="$emit('page', $event)"
  />
</template>

<script setup lang="ts">
interface Emits {
  (e: 'page', event: any): void
}
defineEmits<Emits>()
</script>
```

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
import { ref } from "vue"
import { useQueryVideoPage, useDeleteVideo } from "@/features/teacher/video"
import { VideoFilter, VideoTable } from "@/features/teacher/video"

// ✅ 使用 hooks 管理状态
const { videos, query } = useQueryVideoPage({ current: 1, size: 10 })
const deleteMutation = useDeleteVideo()

// ✅ 只保留 UI 交互逻辑
const filters = ref({})
const onPage = (event: any) => {
  // 处理分页
}
</script>
```

**完整工作流示例**：

```bash
# 1. 确认 API 已生成
grep "postApiTeacherVideosQuery" src/core/api/generated/sdk.gen.ts

# 2. 创建 feature hooks
mkdir -p src/features/teacher/video/hooks
# 创建 useQueryVideo.ts
# 创建 useMutateVideo.ts
# 创建 index.ts

# 3. 创建 feature 组件
mkdir -p src/features/teacher/video/components
# 创建 VideoFilter.vue
# 创建 VideoTable.vue
# 更新 src/features/teacher/video/index.ts

# 4. 创建 page 组件
# 创建 src/pages/teacher/videos/index.page.vue
# 使用 hooks 和组件

# 5. 验证
pnpm typecheck
```

**禁止的反面示例**：

```vue
<!-- ❌ 错误：在页面中直接调用 API -->
<script setup lang="ts">
const { data } = useQuery({
  queryFn: () => fetch('/api/videos')  // ❌ 禁止手动 fetch
})
</script>

<!-- ❌ 错误：在页面中定义 mutation -->
<script setup lang="ts">
const uploadMutation = useMutation({  // ❌ 应该在 hooks 中
  mutationFn: async (file) => {
    const formData = new FormData()  // ❌ 应该用生成的 API
    formData.append('file', file)
    return fetch('/api/upload', {    // ❌ 禁止手动 fetch
      method: 'POST',
      body: formData,
    })
  }
})
</script>

<!-- ✅ 正确：使用 feature hooks -->
<script setup lang="ts">
import { useQueryVideoPage, useUploadVideo } from "@/features/teacher/video"

const { videos, query } = useQueryVideoPage({ current: 1, size: 10 })
const uploadMutation = useUploadVideo()
</script>
```

**理由**：
- **职责分离**：API 层、业务层、展示层各司其职
- **代码复用**：hooks 可在多个页面中复用
- **易于测试**：独立的 hooks 和组件更容易测试
- **维护性强**：修改 API 只需更新 hooks，不影响页面
- **类型安全**：自动生成的 API 类型确保类型正确
- **统一风格**：所有功能都按同样的结构组织
