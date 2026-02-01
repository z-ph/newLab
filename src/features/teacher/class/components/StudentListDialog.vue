<template>
  <Dialog
    v-model:visible="visible"
    :header="`班级学生 - ${internalClassCode}`"
    :modal="true"
    :style="{ maxWidth: '100vw' }"
  >
    <div class="mb-4 flex items-center justify-between gap-4">
      <InputText
        v-model="searchKeyword"
        placeholder="搜索学生姓名或学号"
        class="flex-1"
        @keyup.enter="handleSearch"
      />
      <Button
        label="添加学生"
        icon="pi pi-plus"
        @click="showAddDialog = true"
      />
    </div>

    <DataTable
      :value="students"
      :paginator="true"
      :rows="10"
      :loading="isLoading"
      :total-records="total"
      :rows-per-page-options="[10, 20, 50]"
      @page="onPageChange"
    >
      <Column key="studentUsername" field="studentUsername" header="学号" />
      <Column key="bindTime" field="bindTime" header="绑定时间">
        <template #body="slotProps">
          {{ formatDateTime(slotProps.data.bindTime) }}
        </template>
      </Column>
      <Column key="actions" header="操作">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            severity="danger"
            size="small"
            @click="confirmRemove(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- 添加学生对话框 -->
    <Dialog
      v-model:visible="showAddDialog"
      header="添加学生"
      :modal="true"
      :style="{ maxWidth: '100vw' }"
    >
      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          学生学号（多个用逗号或换行分隔）
        </label>
        <Textarea
          v-model="studentInput"
          rows="5"
          placeholder="请输入学生学号，多个学号用逗号或换行分隔&#10;例如：2021001, 2021002, 2021003"
          class="w-full"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="showAddDialog = false" />
        <Button label="添加" :loading="adding" @click="handleAddStudents" />
      </div>
    </Dialog>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useBindStudents, useUnbindStudents } from '@/features/teacher/class/hooks/useMutateClassStudents'
import { useQueryStudentList } from '@/features/teacher/class/hooks/useQueryStudentList'
import type { StudentClassRelation } from '@/core/api/generated'
import { formatDateTime } from '@/features/shared/utils'

// ==================== Props & Emits ====================
interface Emits {
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()
const visible = defineModel<boolean>()

// 保存内部状态
const internalClassCode = ref('')

function open(options: { classCode: string }) {
  internalClassCode.value = options.classCode
  visible.value = true
}

function close() {
  visible.value = false
}

defineExpose({ open, close })

// ==================== Toast & Confirm ====================
const toast = useToast()
const confirm = useConfirm()

// ==================== 数据查询（使用 Hook）====================
const {
  current,
  size,
  searchKeyword,
  students,
  total,
  isLoading,
  query,
} = useQueryStudentList(internalClassCode.value, { current: 1, size: 10 })

// ==================== 添加学生相关 ====================
const showAddDialog = ref(false)
const studentInput = ref('')
const adding = ref(false)
const bindMutation = useBindStudents()
const unbindMutation = useUnbindStudents()

// ==================== 对话框打开时查询数据 ====================
watch(
  visible,
  (newVal) => {
    if (newVal) {
      query.refetch()
    }
  },
)

// ==================== 分页处理 ====================
const onPageChange = (event: any) => {
  current.value = event.page + 1
  size.value = event.rows
}

// ==================== 搜索 ====================
const handleSearch = () => {
  current.value = 1
}

// ==================== 添加学生 ====================
const handleAddStudents = async () => {
  if (!studentInput.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入学生学号',
      life: 3000,
    })
    return
  }

  // 解析学号列表（支持逗号、换行、空格分隔）
  const usernames = studentInput.value
    .split(/[,\n\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (usernames.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入有效的学生学号',
      life: 3000,
    })
    return
  }

  adding.value = true
  await bindMutation.mutateAsync({
    path: { classCode: internalClassCode.value },
    body: {
      classCode: internalClassCode.value,
      studentUsernames: usernames,
    },
  })

  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `成功添加 ${usernames.length} 名学生`,
    life: 3000,
  })

  showAddDialog.value = false
  studentInput.value = ''
  query.refetch()
  emit('refresh')
  adding.value = false
}

// ==================== 移除学生 ====================
const confirmRemove = (student: StudentClassRelation) => {
  confirm.require({
    message: `确定要将学生"${student.studentUsername}"移出班级吗？`,
    header: '移除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '移除',
    acceptClass: 'p-button-danger',
    accept: () => handleRemove(student),
  })
}

const handleRemove = async (student: StudentClassRelation) => {
  await unbindMutation.mutateAsync({
    path: { classCode: internalClassCode.value },
    body: [student.studentUsername!], // ✅ 移除 as any，API 类型定义为 Array<string>
  })

  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '学生已移出班级',
    life: 3000,
  })

  query.refetch()
  emit('refresh')
}
</script>
