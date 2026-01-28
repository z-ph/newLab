import {
  postApiTeacherClass,
  putApiTeacherClassById,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";

export function useCreateClass() {
  return useMutation({
    mutationFn: ({ body }: GetFirstParamsType<typeof postApiTeacherClass>) =>
      postApiTeacherClass({
        body,
      }),
  });
}

export function useUpdateClass() {
  return useMutation({
    mutationFn: ({
      body,
      path,
    }: GetFirstParamsType<typeof putApiTeacherClassById>) =>
      putApiTeacherClassById({
        body,
        path,
      }),
  });
}
