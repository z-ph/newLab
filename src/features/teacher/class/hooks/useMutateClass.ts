import { postApiTeacherClass, putApiTeacherClassByClassCode } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useCreateClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherClass>) => {
      const response = await postApiTeacherClass({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherClassByClassCode>) => {
      const response = await putApiTeacherClassByClassCode({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
