import { postApiExcelImportStudentsWithClasses } from "@/core/api/generated"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import client from "@/core/api/config"
import { toast } from "@/core/utils/toast"

/**
 * 导入结果数据结构
 */
export interface ImportResult {
  successCount?: number
  failCount?: number
  totalCount?: number
  message?: string
}

/**
 * 类型守卫：验证对象是否为 ImportResult
 */
function isImportResult(data: unknown): data is ImportResult {
  if (typeof data !== "object" || data === null) {
    return false
  }
  const obj = data as Record<string, unknown>
  return (
    (obj.successCount === undefined || typeof obj.successCount === "number") &&
    (obj.failCount === undefined || typeof obj.failCount === "number") &&
    (obj.totalCount === undefined || typeof obj.totalCount === "number") &&
    (obj.message === undefined || typeof obj.message === "string")
  )
}

/**
 * 解析后端响应数据
 * 后端可能返回：JSON 字符串或纯文本消息
 */
function parseImportResponse(data: unknown): ImportResult {
  // 如果是字符串，尝试解析为 JSON
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      if (isImportResult(parsed)) {
        return parsed
      }
    } catch {
      // JSON 解析失败，返回纯文本消息
      return { message: data }
    }
  }

  // 如果是对象，直接验证
  if (isImportResult(data)) {
    return data
  }

  // 兜底：转换为字符串
  return { message: String(data) }
}

/**
 * Excel 批量导入学生
 */
export function useImportStudentsByExcel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await postApiExcelImportStudentsWithClasses({
        body: { file },
        client,
      })

      return response.data
    },
    onSuccess: (data) => {
      // 数据校验和解析放在 hook 的 onSuccess 中
      const result = parseImportResponse(data)

      // Invalidate class query cache to refresh the class list
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      })

      // 显示成功消息
      if (result.message) {
        toast.success(result.message)
      } else {
        const successMsg = result.successCount
          ? `成功导入 ${result.successCount} 名学生`
          : "导入完成"
        toast.success(successMsg)
      }

      // 返回解析后的结果，供组件使用
      return result
    },
  })
}
