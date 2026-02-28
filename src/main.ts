import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import type { ToastServiceMethods } from 'primevue/toastservice'
import 'primeicons/primeicons.css'

// TanStack Query
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './core/api/queryClient'

// 全局 Toast 服务
import { initToast } from './core/utils/toast'

// API 客户端配置 - 必须在应用启动时导入以设置拦截器
import './core/api/config'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, {
  queryClient,
})
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false,
    },
  },
})

// 安装 ToastService 插件
app.use(ToastService)

// 安装 ConfirmationService 插件
app.use(ConfirmationService)

// 初始化全局 Toast 服务实例（在 mount 之前）
// ToastService 安装后会在 globalProperties 上创建 $toast
const instance = createApp({})
instance.use(ToastService)
const toastService = instance.config.globalProperties.$toast as ToastServiceMethods
initToast(toastService)

app.mount('#app')
