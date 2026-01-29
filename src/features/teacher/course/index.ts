/**
 * Course Feature 统一导出
 */

// Components
export { default as CourseFormDialog } from './components/CourseFormDialog.vue'
export { default as CourseTable } from './components/CourseTable.vue'

// Hooks - 从统一导出文件导入
export {
  useQueryCourseAll,
  useQueryCoursePage,
  useQueryCourseById,
  useQueryCourseExperiments,
  useQueryCourseGrades,
  useQueryCourseSubmissions,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useExportCourseGrades,
} from './hooks'
