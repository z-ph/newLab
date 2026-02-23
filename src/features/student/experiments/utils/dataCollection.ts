/**
 * 数据采集步骤类型定义
 */

import type { DataCollectionDetail, DataCollectionDetail1, DataCollectionDetail2 } from '@/core/api/generated'

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
  fillBlankAnswers?: string  // JSON.stringify
  tableCellAnswers?: string  // JSON.stringify
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
  const fillBlankMap = hasFillBlankAnswers(detail) ? detail.fillBlankAnswers : undefined
  let dataFields = mapStringToRecord(fillBlankMap)

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
  const tableCellMap = hasTableCellAnswers(detail) ? detail.tableCellAnswers : undefined
  let tableData = parseTableConfig(mapStringToRecord(tableCellMap))

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

/**
 * 将表格数据转换为 API 所需的键格式
 */
export function buildTableCellAnswers(
  rowHeaders: string[],
  columnHeaders: string[],
  cellValues: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {}

  rowHeaders.forEach((row) => {
    columnHeaders.forEach((col) => {
      const key = `${row}-${col}`
      const value = cellValues[key]
      if (value !== undefined) {
        result[key] = value
      }
    })
  })

  return result
}

/**
 * MapString 类型转换辅助函数
 * 注意：API 中的 MapString 类型定义不完整，实际使用时需要类型转换
 * TODO: 等 API 类型修复后应移除此辅助函数
 */
export function mapStringToRecord(map?: { key?: string } | null): Record<string, string> {
  if (!map) return {}
  // MapString 实际上是 Record<string, string> 的序列化形式
  // 这里需要类型断言是因为 OpenAPI 生成器没有正确生成该类型
  return map as Record<string, string>
}
