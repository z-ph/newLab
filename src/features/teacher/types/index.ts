/**
 * 老师端类型定义
 * 基于自动生成的 API 类型通过类型运算派生，避免重复定义
 *
 * 架构说明：
 * - 业务特定类型：定义在对应的模块文件中（class.ts, experiment.ts 等）
 * - 通用类型：从 @/features/shared/types 导入
 */

// ============================================================================
// 从共享类型导入通用类型
// ============================================================================

export type {
  // 表单相关
  FormData,
  FormFieldConfig,
  FormDialogConfig,
  // 表格相关
  TableColumn,
  PaginationParams,
  TableAction,
  // 菜单相关
  MenuItem,
  // 筛选相关
  FilterCondition,
  SearchParams,
} from '@/features/shared/types'

// ============================================================================
// 导入业务特定类型
// ============================================================================

// 班级相关
export type {
  ClassEntity,
  ClassDetail,
  ClassFormData,
  ClassQueryParams,
} from './class'

// 实验相关
export type {
  ExperimentEntity,
  ExperimentDetail,
  ExperimentFormData,
  ExperimentStatus,
} from './experiment'

// 步骤相关
export type {
  ProcedureEntity,
  ProcedureType,
  VideoProcedureFormData,
  DataCollectionProcedureFormData,
  TopicProcedureFormData,
} from './procedure'

// 提交相关（包含学生相关）
export type {
  SubmissionEntity,
  SubmissionStatus,
  GradingFormData,
  StudentEntity,
  StudentStatus,
} from './submission'

// 成绩相关
export type {
  GradeEntity,
  GradeFormData,
} from './grade'

// 签到相关
export type {
  AttendanceRecordEntity,
  AttendanceInfo,
  StudentAttendanceInfoEntity,
  AttendanceStatus,
} from './attendance'

// 统计相关
export type {
  ClassExperimentStatistics,
  StudentCompletion,
  ProcedureStatisticsEntity,
} from './statistics'

// 菜单相关（类型安全）
export type {
  TeacherMenuItem,
  PrimeIcon,
  MenuRouteMap,
} from './menu'
