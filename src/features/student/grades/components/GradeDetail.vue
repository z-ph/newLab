<template>
  <div>
    <div v-if="isLoading" class="flex justify-center p-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="grade" class="space-y-6">
      <!-- 基本信息 -->
      <Card>
        <template #title>成绩信息</template>
        <template #content>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">课程名称</label>
              <p class="font-medium">{{ grade.courseName || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">成绩</label>
              <div class="flex items-center gap-2">
                <Tag
                  :value="grade.grade"
                  :severity="getGradeSeverity(grade.gradeNumeric)"
                />
                <span v-if="grade.gradeNumeric" class="font-medium">
                  {{ grade.gradeNumeric }} 分
                </span>
              </div>
            </div>
            <div>
              <label class="text-sm text-gray-500">成绩等级</label>
              <p class="font-medium">
                <Tag
                  :value="getGradeLevel(grade.gradeNumeric)"
                  :severity="getGradeSeverity(grade.gradeNumeric)"
                />
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-500">成绩类型</label>
              <p class="font-medium">{{ grade.gradeType || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">学期</label>
              <p class="font-medium">{{ grade.semester || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">满分值</label>
              <p class="font-medium">{{ grade.maxScore || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">教师姓名</label>
              <p class="font-medium">{{ grade.teacherName || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">打分时间</label>
              <p class="font-medium">{{ formatDateTime(grade.gradeTime) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">审核状态</label>
              <p class="font-medium">
                <Tag
                  :value="grade.isApproved ? '已审核' : '未审核'"
                  :severity="grade.isApproved ? 'success' : 'warning'"
                />
              </p>
            </div>
            <div v-if="grade.approvedBy">
              <label class="text-sm text-gray-500">审核人</label>
              <p class="font-medium">{{ grade.approvedBy }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 教师评语 -->
      <Card v-if="grade.teacherComment">
        <template #title>教师评语</template>
        <template #content>
          <p class="text-gray-700">{{ grade.teacherComment }}</p>
        </template>
      </Card>
    </div>

    <div v-else class="text-center text-gray-500 p-8">
      暂无成绩详情
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryGradeDetail } from '../hooks'
import { formatDateTime } from '@/features/shared/utils'
import {
  getGradeSeverity,
  getGradeLevel,
} from '../utils'
import { computed } from 'vue';

interface Props {
  gradeId: number
}

const props = defineProps<Props>()

const { grade, query } = useQueryGradeDetail(computed(()=>props.gradeId))
const isLoading = query.isLoading
</script>
