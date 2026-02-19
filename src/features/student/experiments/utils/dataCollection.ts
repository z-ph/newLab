/**
 * 数据采集步骤类型定义
 */

import type { DataCollectionDetail, DataCollectionDetail2 } from '@/core/api/generated'

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
 * 从 DataCollectionDetail 或 DataCollectionDetail2 转换为表单数据
 */
export function dataCollectionToFormData(detail?: DataCollectionDetail | DataCollectionDetail2 | null): {
  dataFields: Record<string, string>
  tableData: {
    rowHeaders: string[]
    columnHeaders: string[]
    answers: Record<string, string>
  }
} {
  // 处理关键数据字段
  // 注意：API 中的 MapString 类型定义不完整，实际使用时需要类型转换
  const fillBlankMap = detail?.fillBlankAnswers
  const dataFields = mapStringToRecord(fillBlankMap)

  // 处理表格数据
  const tableCellMap = detail?.tableCellAnswers
  const tableData = parseTableConfig(mapStringToRecord(tableCellMap))

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
