/**
 * 下载 Blob 文件到本地
 * @param blob - 要下载的 Blob 对象
 * @param filename - 下载的文件名
 * @example
 * downloadFile(blob, "学生导入模板.xlsx")
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
