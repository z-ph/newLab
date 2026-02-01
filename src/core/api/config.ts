import axios from "axios";
import router from "@/router";
import { createClient } from "./generated/client";
import { TokenManager } from "@/core/entity/TokenManager";
import { UserManager } from "@/core/entity/UserManager";
import { toast } from "@/core/utils/toast";
import type { RouteNamedMap } from "vue-router/auto-routes";

// 从 RouteNamedMap 提取公开路由类型
type PublicRoute = keyof RouteNamedMap & ("/" | "/login");
export const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.BASE_URL
/**
 * 创建 axios 实例
 */
const axiosInstance = axios.create({
  baseURL,
});

// 添加请求拦截器 - 自动添加认证 tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// 添加响应拦截器 - 处理 401 错误和业务错误码
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理 JSON 响应的业务错误码
    const data = response.data as {
      code?: number;
      message?: string;
      data?: unknown;
    };
    // 如果是二进制数据，直接返回
    if (response.config.responseType === "blob") {
      return response;
    }
    // 检查业务错误码
    if (data?.code !== 200) {
      const errorMsg = data?.message || "未知错误";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    return response;
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response?.status === 401) {
      // Token 过期或未授权，清除本地存储并跳转到登录页
      TokenManager.removeToken();
      UserManager.removeUserInfo();
      toast.error("未授权，请重新登录");
      router.replace({ name: "/login" as PublicRoute });
      throw new Error("未授权，请重新登录");
    }

    // 处理其他 HTTP 错误
    const errorMsg =
      error.response?.data?.message || error.message || "未知错误";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  },
);

/**
 * 创建 hey-api 客户端实例
 * 使用自定义的 axios 实例
 */
const client = createClient({
  axios: axiosInstance,
  throwOnError:true
});

export default client;
export { client, axiosInstance };
