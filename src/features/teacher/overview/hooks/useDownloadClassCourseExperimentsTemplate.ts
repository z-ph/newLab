import { getApiExcelTemplateClassCourseExperiments } from "@/core/api/generated"
import { useMutation } from "@tanstack/vue-query"
import client from "@/core/api/config"
import { toast } from "@/core/utils/toast"
import { downloadFile } from "@/core/utils/file"

/**
 * 下载班级课程实验 Excel 导入模板
 */
export function useDownloadClassCourseExperimentsTemplate() {
  return useMutation({
    mutationFn: async () => {
      const response = await getApiExcelTemplateClassCourseExperiments({
        client,
        responseType: "blob",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
      if(!(response.data instanceof Blob)) {
        throw new Error("返回数据不是有效的文件格式")
      }
      return response.data
    },
    onSuccess: (blob) => {
      downloadFile(blob, "班级课程实验导入模板.xlsx")
      toast.success("模板文件已下载")
    },
  })
}
