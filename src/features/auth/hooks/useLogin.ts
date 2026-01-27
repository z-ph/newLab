import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { Router } from "vue-router";
import {
  postApiAuthLogin,
  postApiWechatLogin,
  getApiAuthCheckUserStatusByUsername,
  getApiWechatBindStatus,
} from "@/core/api/generated";
import type { LoginResponse } from "@/core/api/generated";
import { client } from "@/core/api/config";
import { ElMessage } from "element-plus";
import { TokenManager } from "@/core/entity/TokenManager";
import { UserManager } from "@/core/entity/UserManager";

/**
 * 保存登录信息
 */
const saveAuthData = (data: LoginResponse) => {
  TokenManager.setToken(data?.token ?? null);
  UserManager.setUserInfo(data);
};

/**
 * 登录成功后的处理
 */
const handleLoginSuccess = (data: LoginResponse, router: Router) => {
  saveAuthData(data);
  ElMessage.success("登录成功");
  router.push("/");
};

/**
 * 登录 Mutation Hook
 */
export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await postApiAuthLogin({
        client,
        body: {
          username: credentials.username,
          password: credentials.password,
        },
      });
      return response.data?.data;
    },
    onSuccess: (data) => {
      handleLoginSuccess(data!, router);
    },
  });
}

/**
 * 微信登录 Mutation Hook
 */
export function useWechatLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await postApiWechatLogin({
        client,
        query: {
          code,
        },
      });
      return response.data?.data;
    },
    onSuccess: (data) => {
      handleLoginSuccess(data!, router);
    },
  });
}

/**
 * 用户登录 Hook
 */
export function useLogin() {
  const username = ref("");
  const password = ref("");
  const wechatCode = ref("");

  const loginMutation = useLoginMutation();
  const wechatLoginMutation = useWechatLoginMutation();

  /**
   * 处理用户登录
   */
  const handleLogin = async () => {
    if (!username.value) {
      ElMessage.warning("请输入用户名");
      return;
    }

    if (!password.value) {
      ElMessage.warning("请输入密码");
      return;
    }

    loginMutation.mutate({
      username: username.value,
      password: password.value,
    });
  };

  /**
   * 微信登录
   */
  const handleWechatLogin = (code: string) => {
    wechatCode.value = code;
    wechatLoginMutation.mutate(code);
  };

  return {
    username,
    password,
    isPending: loginMutation.isPending,
    wechatCode,
    handleLogin,
    handleWechatLogin,
  };
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
      });
      return response.data?.data;
    },
    enabled: !!username,
  });
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
      });
      return response.data?.data;
    },
  });
}
