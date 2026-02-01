import { getApiTestExcelTemplateUsers } from "@/core/api/generated"
import { useMutation } from "@tanstack/vue-query"
import client from "@/core/api/config"
import { toast } from "@/core/utils/toast"

/**
 * 下载 Excel 导入模板
 */
export function useDownloadExcelTemplate() {
  return useMutation({
    mutationFn: async () => {
      const response = await getApiTestExcelTemplateUsers({
        client,
        responseType: "blob",  // 覆盖默认的 'json'，告诉 axios 返回二进制数据
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })

      // response.data 现在应该是 Blob 类型
      return response.data
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "学生导入模板.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("模板文件已下载")
    },
  })
}
