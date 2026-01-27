/**
 * 通用筛选和搜索类型
 */

/**
 * 筛选条件类型
 */
export interface FilterCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains' | 'startsWith'
  value: any
}

/**
 * 搜索参数类型
 */
export interface SearchParams {
  keyword?: string
  filters?: FilterCondition[]
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}
