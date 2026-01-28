import {
  postApiTeacherCourses,
  putApiTeacherCoursesById,
  deleteApiTeacherCoursesById,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 创建课程
 */
export function useCreateCourse() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherCourses>) => {
      const response = await postApiTeacherCourses({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

/**
 * 更新课程
 */
export function useUpdateCourse() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherCoursesById>) => {
      const response = await putApiTeacherCoursesById({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

/**
 * 删除课程
 */
export function useDeleteCourse() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteApiTeacherCoursesById({
        path: { id },
        client,
      });
      return response.data?.data;
    },
  });
}
