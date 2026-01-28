import {
  postApiTeacherClassByClassCodeBindStudents,
  postApiTeacherClassByClassCodeUnbindStudents,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useBindStudents() {
  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassByClassCodeBindStudents>,
    ) => {
      const response = await postApiTeacherClassByClassCodeBindStudents({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUnbindStudents() {
  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassByClassCodeUnbindStudents>,
    ) => {
      const response = await postApiTeacherClassByClassCodeUnbindStudents({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
