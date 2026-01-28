/**
 * 课程管理 hooks 统一导出
 */

// 查询 hooks
export { useQueryCourseAll, useQueryCoursePage, useQueryCourseById } from './useQueryCourse'
export { useQueryCourseExperiments } from './useQueryCourseExperiments'
export { useQueryCourseGrades } from './useQueryCourseGrades'
export { useQueryCourseSubmissions } from './useQueryCourseSubmissions'

// 变更 hooks
export { useCreateCourse, useUpdateCourse, useDeleteCourse } from './useMutateCourse'
export { useExportCourseGrades } from './useMutateCourseExport'
