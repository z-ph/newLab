import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Element Plus 样式需要手动引入
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
