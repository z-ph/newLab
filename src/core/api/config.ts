import router from "@/router";
import { createClient } from "./generated/client";
import { TokenManager } from "@/core/entity/TokenManager";
import { UserManager } from "@/core/entity/UserManager";

/**
 * 创建 API 客户端实例
 */
const client = createClient({
  baseUrl: import.meta.env.DEV ? "/api" : import.meta.env.BASE_URL,
  // 自动根据 Content-Type 解析响应（json, blob, text, formData）
  parseAs: "stream",
});

// 添加请求拦截器 - 自动添加认证 tokens
client.interceptors.request.use(async (request) => {
  const token = TokenManager.getToken();
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  return request;
});

// 添加响应拦截器 - 处理 401 错误和业务错误码
client.interceptors.response.use(async (response) => {
  // 先处理 HTTP 401 错误
  if (response.status === 401) {
    // Token 过期或未授权，清除本地存储并跳转到登录页
    TokenManager.removeToken();
    UserManager.removeUserInfo();
    router.replace({ path: "/login" });
    throw new Error("未授权，请重新登录");
  }

  // 只处理 JSON 响应的业务错误码
  const contentType = response.headers.get("content-type");
  let jsonData;
  if (contentType?.includes("application/json")) {
    try {
      // 克隆 response 以避免消耗原始的 body
      jsonData = (await response.json()) as {
        code?: number;
        message?: string;
      };
    } catch {
      ElMessage.error("JSON解析失败");
    }
    // 检查业务错误码
    if (jsonData?.code !== undefined && jsonData.code !== 200) {
      const errorMsg = jsonData.message || "未知错误";
      ElMessage.error(errorMsg);
      throw Error(errorMsg)
    }
  }
  return response;
});

export default client;
export { client };
