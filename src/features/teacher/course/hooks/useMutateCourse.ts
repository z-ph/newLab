/**
 * 课程变更 hooks
 * TODO: 等待后端添加课程管理 API
 * 需要的接口：
 * - POST /api/teacher/courses - 创建课程
 * - PUT /api/teacher/courses/{courseId} - 更新课程
 * - DELETE /api/teacher/courses/{courseId} - 删除课程
 */

/*
export function useCreateCourse() {
  return useMutation({
    mutationFn: async (params: CreateCourseRequest) => {
      // TODO: 调用后端API创建课程
      const response = await postApiTeacherCourses({
        body: params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateCourse() {
  return useMutation({
    mutationFn: async (params: { courseId: string; data: UpdateCourseRequest }) => {
      // TODO: 调用后端API更新课程
      const response = await putApiTeacherCoursesByCourseId({
        path: { courseId: params.courseId },
        body: params.data,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      // TODO: 调用后端API删除课程
      const response = await deleteApiTeacherCoursesByCourseId({
        path: { courseId },
        client,
      });
      return response.data?.data;
    },
  });
}
*/
