import {
  postApiTeacherClass,
  putApiTeacherClassById,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";

export function useCreateClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherClass>) => {
      const response = await postApiTeacherClass(params);
      return response.data?.data;
    },
  });
}

export function useUpdateClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherClassById>) => {
      const response = await putApiTeacherClassById(params);
      return response.data?.data;
    },
  });
}
