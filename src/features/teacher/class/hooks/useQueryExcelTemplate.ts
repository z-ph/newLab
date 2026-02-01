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
        responseType: "blob",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })

      // 调试信息
      console.log('=== Excel 模板下载响应 ===')
      console.log('response.data:', response.data)
      console.log('response.data 类型:', typeof response.data)
      console.log('是否为 Blob:', response.data instanceof Blob)
      console.log('Blob 大小:', response.data?.size)
      console.log('Blob 类型:', response.data?.type)

      if(!(response.data instanceof Blob)) {
        throw new Error("返回数据不是有效的文件格式")
      }
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
