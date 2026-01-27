/**
 * 通用 UI 配置
 */

/**
 * 表格操作按钮配置
 */
export const TABLE_ACTIONS = {
  edit: { label: '编辑', icon: 'pi pi-pencil', severity: 'primary' },
  delete: { label: '删除', icon: 'pi pi-trash', severity: 'danger' },
  view: { label: '查看', icon: 'pi pi-eye', severity: 'secondary' },
  publish: { label: '发布', icon: 'pi pi-check', severity: 'success' },
  archive: { label: '归档', icon: 'pi pi-folder', severity: 'info' },
} as const

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  rows: 20,
  rowsPerPageOptions: [10, 20, 50, 100],
} as const

/**
 * 默认表单项配置
 */
export const DEFAULT_FORM_CONFIG = {
  pt: {
    root: 'class="flex flex-col gap-2"',
    label: 'class="text-sm font-medium text-slate-700"',
  },
} as const

/**
 * 对话框配置
 */
export const DIALOG_CONFIG = {
  modal: true,
  dismissableMask: true,
  draggable: false,
  style: {
    width: '50vw',
  },
  breakpoints: {
    '960px': '75vw',
    '640px': '90vw',
  },
} as const
