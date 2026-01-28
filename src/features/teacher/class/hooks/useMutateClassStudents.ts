import {
  postApiTeacherClassByClassCodeBindStudents,
  postApiTeacherClassByClassCodeUnbindStudents,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";

export function useBindStudents() {
  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassByClassCodeBindStudents>,
    ) => {
      const response = await postApiTeacherClassByClassCodeBindStudents(params);
      return response.data?.data;
    },
  });
}

export function useUnbindStudents() {
  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassByClassCodeUnbindStudents>,
    ) => {
      const response = await postApiTeacherClassByClassCodeUnbindStudents(params);
      return response.data?.data;
    },
  });
}
