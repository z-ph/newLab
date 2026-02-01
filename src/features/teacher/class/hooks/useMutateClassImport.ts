import { postApiTestExcelImportUsers } from "@/core/api/generated"
import { useMutation } from "@tanstack/vue-query"
import client from "@/core/api/config"

/**
 * Excel批量导入学生
 */
export function useImportStudentsByExcel() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await postApiTestExcelImportUsers({
        body: { file },
        client,
      })

      return response.data
    },
  })
}
