import {
  getApiTeacherProcedureSubmissionsCourseByCourseId,
  getApiTeacherProcedureSubmissionsBySubmissionId,
} from "@/core/api/generated";
import { type Ref, unref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询课程的步骤提交列表
 */
export function useQuerySubmissionsByCourse(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["submissions", "course", unref(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}

/**
 * 查询单个提交详情
 */
export function useQuerySubmissionById(
  submissionId: Ref<number>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["submission", unref(submissionId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsBySubmissionId({
        path: { submissionId: unref(submissionId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
