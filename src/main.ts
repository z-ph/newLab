import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
// Element Plus 样式需要手动引入
import 'element-plus/dist/index.css'

// TanStack Query
import { VueQueryPlugin } from '@tanstack/vue-query'

// API 客户端配置 - 必须在应用启动时导入以设置拦截器
import './core/api/config'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
