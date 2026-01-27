import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@tanstack/vue-query'
import type { Router } from 'vue-router'
import { apiClient } from '@/mock/api'
import type { LoginResponse } from '@/mock/api/types'
import { ElMessage } from 'element-plus'

/**
 * 保存登录信息
 */
const saveAuthData = (data: LoginResponse) => {
  localStorage.setItem('token', data.token)
  localStorage.setItem('userInfo', JSON.stringify({
    username: data.username,
    name: data.name,
    role: data.role,
  }))
}

/**
 * 登录成功后的处理
 */
const handleLoginSuccess = (data: LoginResponse, router: Router) => {
  saveAuthData(data)
  ElMessage.success('登录成功')
  router.push('/')
}

/**
 * 登录 Mutation Hook
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
      handleLoginSuccess(data, router)
    },
    onError: (error: Error) => {
      ElMessage.error(error.message || '登录失败，请稍后重试')
    },
  })
}

/**
 * 微信登录 Mutation Hook
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
      handleLoginSuccess(data, router)
    },
    onError: (error: Error) => {
      ElMessage.error(error.message || '微信登录失败，请稍后重试')
    },
  })
}

/**
 * 用户登录 Hook
 */
export function useLogin() {
  const username = ref('')
  const password = ref('')
  const wechatCode = ref('')

  const loginMutation = useLoginMutation()
  const wechatLoginMutation = useWechatLoginMutation()

  /**
   * 处理用户登录
   */
  const handleLogin = async () => {
    if (!username.value) {
      ElMessage.warning('请输入用户名')
      return
    }

    if (!password.value) {
      ElMessage.warning('请输入密码')
      return
    }

    loginMutation.mutate({
      username: username.value,
      password: password.value,
    })
  }

  /**
   * 微信登录
   */
  const handleWechatLogin = (code: string) => {
    wechatCode.value = code
    wechatLoginMutation.mutate(code)
  }

  return {
    username,
    password,
    isPending: loginMutation.isPending,
    wechatCode,
    handleLogin,
    handleWechatLogin,
  }
}

/**
 * 检查用户状态 Query Hook
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
 * 检查微信绑定状态 Query Hook
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
