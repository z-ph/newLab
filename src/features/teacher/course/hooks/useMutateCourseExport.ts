import { getApiTeacherExportCourseGradesByCourseId } from "@/core/api/generated";
import type { Ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 导出课程成绩
 */
export function useExportCourseGrades() {
  return useMutation({
    mutationFn: async (courseId: string | Ref<string>) => {
      const response = await getApiTeacherExportCourseGradesByCourseId({
        path: { courseId: unref(courseId) },
        client,
      });
      return response.data;
    },
  });
}
