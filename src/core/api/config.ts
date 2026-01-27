import { createClient } from './generated/client'
import { TokenManager } from '@/core/entity/TokenManager'

/**
 * 创建 API 客户端实例
 */
const client = createClient({
  baseUrl: import.meta.env.DEV?'/api':import.meta.env.BASE_URL,
})

// 添加请求拦截器 - 自动添加认证 tokens
client.interceptors.request.use(async (request) => {
  const token = TokenManager.getToken()
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
  return request
})

// 添加响应拦截器 - 处理 401 错误
client.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    // Token 过期或未授权，清除本地存储并跳转到登录页
    TokenManager.removeToken()
    localStorage.removeItem('userInfo')
    window.location.href = '/login'
  }
  return response
})

export default client
export { client }
