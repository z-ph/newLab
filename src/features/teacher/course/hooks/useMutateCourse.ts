import {
  postApiTeacherCourses,
  putApiTeacherCoursesById,
  deleteApiTeacherCoursesById,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 创建课程
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherCourses>) => {
      const response = await postApiTeacherCourses({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-page"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-all"],
      });
    },
  });
}

/**
 * 更新课程
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherCoursesById>) => {
      const response = await putApiTeacherCoursesById({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-page"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-all"],
      });
    },
  });
}

/**
 * 删除课程
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteApiTeacherCoursesById({
        path: { id },
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-page"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses-all"],
      });
    },
  });
}
