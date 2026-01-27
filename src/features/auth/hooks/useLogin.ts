import { ref } from 'vue'
import { useLoginMutation, useWechatLoginMutation } from '@/features/auth/queries/useAuthQuery'

/**
 * 用户登录 Hook
 */
export function useLogin() {
  const username = ref('')
  const password = ref('')
  const wechatCode = ref('')

  // 登录 mutation
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

    // 调用登录 mutation
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
