/**
 * 课程管理 hooks 统一导出
 */

// 查询 hooks
export { useQueryCourseExperiments } from './useQueryCourseExperiments'
export { useQueryCourseGrades } from './useQueryCourseGrades'
export { useQueryCourseSubmissions } from './useQueryCourseSubmissions'

// 变更 hooks
export { useExportCourseGrades } from './useMutateCourseExport'

// TODO: 等待后端添加课程CRUD接口后取消注释
// export { useQueryCourseAll, useQueryCourseById } from './useQueryCourse'
// export { useCreateCourse, useUpdateCourse, useDeleteCourse } from './useMutateCourse'
