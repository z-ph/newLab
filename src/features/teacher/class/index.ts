/**
 * Class Feature 统一导出
 */

// Components
export { default as ClassTable } from './components/ClassTable.vue'
export { default as ClassImportForm } from './components/ClassImportForm.vue'

// Hooks
export {
  useQueryClassAll,
  useQueryClassPage,
} from './hooks/useQueryClass'

export {
  useCreateClass,
  useUpdateClass,
} from './hooks/useMutateClass'

export {
  useBindStudents,
  useUnbindStudents,
} from './hooks/useMutateClassStudents'

export {
  useImportStudentsByExcel,
} from './hooks/useMutateClassImport'

export {
  useDownloadExcelTemplate,
} from './hooks/useQueryExcelTemplate'

export {
  useCreateClassBatch,
} from './hooks/useMutateClassBatch'

export {
  useDeleteClass,
} from './hooks/useMutateClassDelete'

export {
  useQueryClassByCode,
} from './hooks/useQueryClassByCode'

export {
  useBindExperiment,
  useUnbindExperiment,
} from './hooks/useMutateClassExperiment'

export {
  useQueryClassExperiments,
} from './hooks/useQueryClassExperiments'

export {
  useQueryClassExperimentDetail,
} from './hooks/useQueryClassExperimentDetail'

// Utils
export {
  navigateToClassEdit,
  navigateToClassCreate,
  navigateToClassImport,
  navigateToClassBind,
} from './utils'

