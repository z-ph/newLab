import { useMutation, useQuery } from '@tanstack/vue-query'
import { apiClient } from '@/mock/api'
import { ElMessage } from 'element-plus'

/**
 * 登录 Mutation
 */
export function useLoginMutation() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiClient.login(credentials.username, credentials.password)
      if (response.code !== 0) {
        throw new Error(response.message || '登录失败')
      }
      return response.data
    },
    onSuccess: (data) => {
      // 保存用户信息和 token
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify({
        username: data.username,
        name: data.name,
        role: data.role,
      }))

      ElMessage.success('登录成功')

      // 跳转到首页
      router.push('/')
    },
    onError: (error: Error) => {
      ElMessage.error(error.message || '登录失败，请稍后重试')
    },
  })
}

/**
 * 微信登录 Mutation
 */
export function useWechatLoginMutation() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.loginByCode('', code)
      if (response.code !== 0) {
        throw new Error(response.message || '微信登录失败')
      }
      return response.data
    },
    onSuccess: (data) => {
      // 保存用户信息和 token
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify({
        username: data.username,
        name: data.name,
        role: data.role,
      }))

      ElMessage.success('登录成功')

      // 跳转到首页
      router.push('/')
    },
    onError: (error: Error) => {
      ElMessage.error(error.message || '微信登录失败，请稍后重试')
    },
  })
}

/**
 * 检查用户状态 Query
 */
export function useUserStatus(username: string) {
  return useQuery({
    queryKey: ['userStatus', username],
    queryFn: async () => {
      const response = await apiClient.checkUserStatus(username)
      if (response.code !== 0) {
        throw new Error(response.message || '查询用户状态失败')
      }
      return response.data
    },
    enabled: !!username,
  })
}

/**
 * 检查微信绑定状态 Query
 */
export function useWeChatBindStatus() {
  return useQuery({
    queryKey: ['wechatBindStatus'],
    queryFn: async () => {
      const response = await apiClient.getWeChatBindStatus()
      if (response.code !== 0) {
        throw new Error(response.message || '查询微信绑定状态失败')
      }
      return response.data
    },
  })
}
