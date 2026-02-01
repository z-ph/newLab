import {
  getApiTeacherProcedureSubmissionsCourseByCourseId,
  getApiTeacherProcedureSubmissionsBySubmissionId,
} from "@/core/api/generated";
import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询课程的步骤提交列表
 */
export function useQuerySubmissionsByCourse(
  courseId: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["submissions", "course", toValue(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}

/**
 * 查询单个提交详情
 */
export function useQuerySubmissionById(
  submissionId: MaybeRefOrGetter<number>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["submission", toValue(submissionId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsBySubmissionId({
        path: { submissionId: toValue(submissionId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
