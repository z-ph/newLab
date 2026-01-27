/**
 * 通用表格类型
 */

/**
 * 表格列配置
 */
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | true
  sortable?: boolean
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  size: number
  total?: number
}

/**
 * 表格操作按钮
 */
export interface TableAction {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  onClick: (row: any) => void
  show?: (row: any) => boolean
}
