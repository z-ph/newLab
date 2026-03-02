import { postApiTeacherClassBatch } from "@/core/api/generated"
import type { GetFirstParamsType } from "@/core/utils/typeUtils"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import client from "@/core/api/config"

export function useCreateClassBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherClassBatch>) => {
      const response = await postApiTeacherClassBatch({
        ...params,
        client,
      })
      return response.data?.data
    },
    onSuccess: () => {
      // Invalidate class query cache to refresh the class list
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      })
    },
  })
}
