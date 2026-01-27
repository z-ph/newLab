<template>
  <div
    class="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 font-['Source_Han_Sans_SC','PingFang_SC','Microsoft_YaHei',sans-serif]"
  >
    <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <ElCard
        shadow="never"
        class="w-full max-w-[440px] border border-white/60 bg-white/80 backdrop-blur"
        :body-style="{ padding: '32px' }"
      >
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-white/70"
            >
              <SchoolCrestIcon :size="40" />
            </div>
            <div>
              <h1 class="text-2xl font-semibold tracking-tight text-slate-900">广工大实验教学平台</h1>
              <p class="text-sm text-slate-500">广东工业大学实验教学部</p>
            </div>
          </div>

          <el-form class="space-y-4" @keyup.enter="onLogin">
            <el-form-item class="mb-0">
              <ElInput
                v-model="username"
                size="large"
                placeholder="请输入账号"
                autocomplete="username"
                clearable
              >
                <template #prefix>
                  <el-icon class="text-slate-400">
                    <User />
                  </el-icon>
                </template>
              </ElInput>
            </el-form-item>
            <el-form-item class="mb-0">
              <ElInput
                v-model="password"
                size="large"
                placeholder="请输入密码"
                type="password"
                show-password
                autocomplete="current-password"
                clearable
              >
                <template #prefix>
                  <el-icon class="text-slate-400">
                    <Lock />
                  </el-icon>
                </template>
              </ElInput>
            </el-form-item>
            <ElButton
              type="primary"
              size="large"
              class="w-full"
              :loading="props.isPending"
              @click="onLogin"
            >
              登录
            </ElButton>
          </el-form>
        </div>
      </ElCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue';
import SchoolCrestIcon from '@/features/shared/components/SchoolCrestIcon.vue';
const username = defineModel<string>('username');
const password = defineModel<string>('password');
const props = defineProps<{ isPending: boolean; code: string }>();
const emit = defineEmits(['login', 'get-wechat-code', 'loginByCode']);
const onLogin = () => emit('login', { code: props.code });
</script>
