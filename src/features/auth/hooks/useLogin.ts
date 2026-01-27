import { ref } from "vue"
import { useRouter } from "vue-router"
import { useMutation, useQuery } from "@tanstack/vue-query"
import {
  postApiAuthLogin,
  postApiWechatLogin,
  getApiAuthCheckUserStatusByUsername,
  getApiWechatBindStatus,
} from "@/core/api/generated"
import type { LoginResponse } from "@/core/api/generated"
import { client } from "@/core/api/config"
import { toast } from "@/core/utils/toast"
import { TokenManager } from "@/core/entity/TokenManager"
import { UserManager } from "@/core/entity/UserManager"
import { getHomePathForRole, type UserRole } from "@/core/utils/routeGuards"

/**
 * 保存登录信息
 */
const saveAuthData = (data: LoginResponse) => {
  TokenManager.setToken(data?.token ?? null)
  UserManager.setUserInfo(data)
  toast.success("登录成功")
}

/**
 * 登录 Mutation Hook
 */
export function useLoginMutation() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await postApiAuthLogin({
        client,
        body: {
          username: credentials.username,
          password: credentials.password,
        },
      })
      return response.data?.data
    },
    onSuccess: (data) => {
      saveAuthData(data!)
      const role = data?.role as UserRole | undefined
      if (role) {
        router.push(getHomePathForRole(role))
      } else {
        router.push("/")
      }
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
      const response = await postApiWechatLogin({
        client,
        query: {
          code,
        },
      })
      return response.data?.data
    },
    onSuccess: (data) => {
      saveAuthData(data!)
      const role = data?.role as UserRole | undefined
      if (role) {
        router.push(getHomePathForRole(role))
      } else {
        router.push("/")
      }
    },
  })
}

/**
 * 用户登录 Hook
 */
export function useLogin() {
  const username = ref("")
  const password = ref("")
  const wechatCode = ref("")

  const loginMutation = useLoginMutation()
  const wechatLoginMutation = useWechatLoginMutation()

  /**
   * 处理用户登录
   */
  const handleLogin = async () => {
    if (!username.value) {
      toast.warn("请输入用户名")
      return
    }

    if (!password.value) {
      toast.warn("请输入密码")
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
    queryKey: ["userStatus", username],
    queryFn: async () => {
      const response = await getApiAuthCheckUserStatusByUsername({
        client,
        path: {
          username: username,
        },
      })
      return response.data?.data
    },
    enabled: !!username,
  })
}

/**
 * 检查微信绑定状态 Query Hook
 */
export function useWeChatBindStatus() {
  return useQuery({
    queryKey: ["wechatBindStatus"],
    queryFn: async () => {
      const response = await getApiWechatBindStatus({
        client,
      })
      return response.data?.data
    },
  })
}
