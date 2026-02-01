/**
 * Experiment Feature 统一导出
 */

// Components
export { default as ExperimentDetailDialog } from './components/ExperimentDetailDialog.vue'
export { default as ExperimentFormDialog } from './components/ExperimentFormDialog.vue'
export { default as ExperimentTable } from './components/ExperimentTable.vue'
export { default as ProcedureFormDialog } from './procedure/components/ProcedureFormDialog.vue'
export { default as ProcedureList } from './procedure/components/ProcedureList.vue'

export { default as ProcedureVideoForm } from './procedure/components/procedure-forms/ProcedureVideoForm.vue'
export { default as ProcedureDataCollectionForm } from './procedure/components/procedure-forms/ProcedureDataCollectionForm.vue'
export { default as ProcedureTopicForm } from './procedure/components/procedure-forms/ProcedureTopicForm.vue'
export { default as ProcedureTimeConfig } from './procedure/components/procedure-forms/ProcedureTimeConfig.vue'

// Hooks
export {
  useQueryExperimentAll,
} from './hooks/useQueryExperiment'

export {
  useQueryExperimentByCourse,
} from './hooks/useQueryExperimentByCourse'

export {
  useQueryExperimentById,
} from './hooks/useQueryExperimentById'

export {
  useCreateExperiment,
  useUpdateExperiment,
} from './hooks/useMutateExperiment'

export {
  useDeleteExperiment,
} from './hooks/useMutateExperimentDelete'

export {
  useCreateVideoProcedure,
  useUpdateVideoProcedure,
  useCreateDataCollectionProcedure,
  useUpdateDataCollectionProcedure,
  useCreateTopicProcedure,
  useUpdateTopicProcedure,
} from './procedure/hooks/useMutateProcedure'

export {
  useInsertVideoProcedure,
  useInsertDataCollectionProcedure,
  useInsertTopicProcedure,
} from './procedure/hooks/useMutateProcedureInsert'

export {
  useDeleteProcedure,
} from './procedure/hooks/useMutateProcedureDelete'

export {
  useQueryProceduresByExperiment,
  useQueryProcedureById,
} from './procedure/hooks/useQueryProcedure'

export {
  useQueryVideosAll,
} from './procedure/hooks/useQueryVideos'

// Types
export type {
  ProcedureEntity,
  ProcedureType,
  DataCollectionDataType,
  VideoProcedureFormData,
  DataCollectionProcedureFormData,
  TopicProcedureFormData,
  VideoProcedureUpdateFormData,
  DataCollectionProcedureUpdateFormData,
  TopicProcedureUpdateFormData,
  ProcedureFormData,
} from './procedure/types'

export {
  createDefaultProcedureFormData,
} from './procedure/types'

// Constants
export {
  PROCEDURE_TYPE,
  DATA_COLLECTION_TYPE,
  PROCEDURE_TYPE_OPTIONS,
  DATA_COLLECTION_TYPE_OPTIONS,
  DEFAULT_VALUES,
  TIME_LIMITS,
  TIME_UNITS,
  FORM_PLACEHOLDERS,
  FORM_HINTS,
  BUTTON_LABELS,
  VALIDATION_RULES,
  PREDEFINED_TAGS,
  JSON_FIELD_PLACEHOLDER,
  ROW_HEADERS_PLACEHOLDER,
  COLUMN_HEADERS_PLACEHOLDER,
  CUSTOM_TAG_PLACEHOLDER,
  TOPIC_IDS_PLACEHOLDER,
  TOPIC_IDS_HINT,
  ADD_BUTTON_LABEL,
  MIN_TOPIC_NUMBER,
} from './procedure/constants'

// Utils
export {
  formatVideoDuration,
  parseJson,
  parseArray,
  ProcedureTimeCalculator,
  TimedQuizKeyGenerator,
} from './procedure/utils'

