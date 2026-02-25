/**
 * 数据采集���骤类型定义
 */

import type {
  DataCollectionDetail,
  DataCollectionDetail1,
  DataCollectionDetail2,
  FillBlankAnswer,
  TableCellAnswer,
} from '@/core/api/generated'

/**
 * 表单数据类型
 */
export interface DataCollectionFormData {
  fillBlankAnswers: Record<string, string>
  tableCellAnswers: Record<string, string>
  photo: File | null
  document: File | null
}

/**
 * 提交参数类型
 */
export interface DataCollectionSubmitParams {
  fillBlankAnswers?: FillBlankAnswer[]
  tableCellAnswers?: TableCellAnswer[]
  photos?: File
  documents?: File
}

/**
 * remark 字段中的配置结构（关键数据类型）
 */
interface KeyDataRemarkConfig {
  dataFields?: string[]
}

/**
 * remark 字段中的配置结构（表格数据类型）
 */
interface TableDataRemarkConfig {
  rowHeaders?: string[]
  columnHeaders?: string[]
}

/**
 * 检查对象是否有 fillBlankAnswers 字段
 */
function hasFillBlankAnswers(obj: unknown): obj is DataCollectionDetail2 {
  return typeof obj === 'object' && obj !== null && 'fillBlankAnswers' in obj
}

/**
 * 检查对象是否有 tableCellAnswers 字段
 */
function hasTableCellAnswers(obj: unknown): obj is DataCollectionDetail2 {
  return typeof obj === 'object' && obj !== null && 'tableCellAnswers' in obj
}

/**
 * 将 FillBlankAnswer 数组转换为 Record
 */
export function fillBlankAnswersToRecord(answers?: FillBlankAnswer[] | null): Record<string, string> {
  if (!answers || !Array.isArray(answers)) return {}
  return answers.reduce((acc, item) => {
    if (item.fieldName) {
      acc[item.fieldName] = item.value ?? ''
    }
    return acc
  }, {} as Record<string, string>)
}

/**
 * 将 TableCellAnswer 数组转换为 Record
 */
export function tableCellAnswersToRecord(answers?: TableCellAnswer[] | null): Record<string, string> {
  if (!answers || !Array.isArray(answers)) return {}
  return answers.reduce((acc, item) => {
    if (item.cellPosition) {
      acc[item.cellPosition] = item.value ?? ''
    }
    return acc
  }, {} as Record<string, string>)
}

/**
 * 将 Record 转换为 FillBlankAnswer 数组
 */
export function recordToFillBlankAnswers(record: Record<string, string>): FillBlankAnswer[] {
  return Object.entries(record).map(([fieldName, value]) => ({
    fieldName,
    value,
  }))
}

/**
 * 将 Record 转换为 TableCellAnswer 数组
 */
export function recordToTableCellAnswers(record: Record<string, string>): TableCellAnswer[] {
  return Object.entries(record).map(([cellPosition, value]) => ({
    cellPosition,
    value,
  }))
}

/**
 * 从 DataCollectionDetail 或 DataCollectionDetail2 转换为表单数据
 *
 * 学生端 API 返回的 detail 只有 remark 字段（包含 JSON 配置）
 * 已完成的提交会有 fillBlankAnswers/tableCellAnswers 字段
 */
export function dataCollectionToFormData(detail?: DataCollectionDetail | DataCollectionDetail1 | DataCollectionDetail2 | null): {
  dataFields: Record<string, string>
  tableData: {
    rowHeaders: string[]
    columnHeaders: string[]
    answers: Record<string, string>
  }
} {
  // 处理关键数据字段
  // 优先使用 fillBlankAnswers（已完成的提交），否则从 remark 解析
  let dataFields: Record<string, string> = {}
  if (hasFillBlankAnswers(detail) && detail.fillBlankAnswers) {
    dataFields = fillBlankAnswersToRecord(detail.fillBlankAnswers)
  }

  // 如果没有 fillBlankAnswers，从 remark 解析 dataFields 配置
  if (Object.keys(dataFields).length === 0 && detail?.remark) {
    try {
      const config = JSON.parse(detail.remark) as KeyDataRemarkConfig
      if (config.dataFields) {
        // 将字段名数组转换为 Record（值为空字符串，等待用户填写）
        dataFields = config.dataFields.reduce((acc, field) => {
          acc[field] = ''
          return acc
        }, {} as Record<string, string>)
      }
    } catch (error) {
      console.warn('[dataCollectionToFormData] 解析 dataFields 配置失败:', error, { remark: detail.remark })
    }
  }

  // 处理表格数据
  let tableData = { rowHeaders: [] as string[], columnHeaders: [] as string[], answers: {} as Record<string, string> }
  if (hasTableCellAnswers(detail) && detail.tableCellAnswers) {
    const answers = tableCellAnswersToRecord(detail.tableCellAnswers)
    tableData = parseTableConfig(answers)
  }

  // 如果没有 tableCellAnswers，从 remark 解析表格配置
  if (Object.keys(tableData.answers).length === 0 && detail?.remark) {
    try {
      const config = JSON.parse(detail.remark) as TableDataRemarkConfig
      if (config.rowHeaders && config.columnHeaders) {
        tableData = {
          rowHeaders: config.rowHeaders,
          columnHeaders: config.columnHeaders,
          answers: {},
        }
      }
    } catch (error) {
      console.warn('[dataCollectionToFormData] 解析表格配置失败:', error, { remark: detail.remark })
    }
  }

  return { dataFields, tableData }
}

/**
 * 解析表格配置，提取行列表头
 */
export function parseTableConfig(answers: Record<string, string>): {
  rowHeaders: string[]
  columnHeaders: string[]
  answers: Record<string, string>
} {
  const rowSet = new Set<string>()
  const colSet = new Set<string>()

  Object.keys(answers).forEach((key) => {
    const parts = key.split('-')
    if (parts.length === 2) {
      const [row, col] = parts
      if (row) rowSet.add(row)
      if (col) colSet.add(col)
    }
  })

  return {
    rowHeaders: Array.from(rowSet),
    columnHeaders: Array.from(colSet),
    answers,
  }
}
