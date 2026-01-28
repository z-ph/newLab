import {
  getApiTeacherProcedureSubmissionsCourseByCourseId,
  getApiTeacherProcedureSubmissionsBySubmissionId,
} from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 查询课程的步骤提交列表
 */
export function useQuerySubmissionsByCourse(
  courseId: string | Ref<string>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["submissions", "course", courseId],
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}

/**
 * 查询单个提交详情
 */
export function useQuerySubmissionById(
  submissionId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["submission", submissionId],
    queryFn: () =>
      getApiTeacherProcedureSubmissionsBySubmissionId({
        path: { submissionId: unref(submissionId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
