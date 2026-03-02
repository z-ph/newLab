import {
  postApiTeacherClassClasscodeBindStudents,
  postApiTeacherClassClasscodeUnbindStudents,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useBindStudents() {
  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassClasscodeBindStudents>,
    ) => {
      const response = await postApiTeacherClassClasscodeBindStudents({
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
      params: GetFirstParamsType<typeof postApiTeacherClassClasscodeUnbindStudents>,
    ) => {
      const response = await postApiTeacherClassClasscodeUnbindStudents({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
