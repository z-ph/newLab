/**
 * Class Feature 统一导出
 */

// Components
export { default as StudentListDialog } from './components/StudentListDialog.vue'
export { default as ClassTable } from './components/ClassTable.vue'

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

