<template>
  <div
    class="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 font-['Source_Han_Sans_SC','PingFang_SC','Microsoft_YaHei',sans-serif]"
  >
    <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <Card
        class="w-full max-w-[440px] border border-white/60 bg-white/80 backdrop-blur shadow-lg"
      >
        <template #content>
          <div class="flex flex-col gap-6 p-8">
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

            <form class="space-y-4" @submit.prevent="onLogin">
              <div class="space-y-2">
                <FloatLabel>
                  <InputText
                    v-model="username"
                    :autocomplete="'username'"
                    class="w-full"
                  />
                  <label>账号</label>
                </FloatLabel>
              </div>

              <div class="space-y-2">
                <FloatLabel>
                  <Password
                    v-model="password"
                    :feedback="false"
                    :toggle-mask="true"
                    class="w-full"
                  />
                  <label>密码</label>
                </FloatLabel>
              </div>

              <Button
                type="submit"
                label="登录"
                class="w-full"
                :loading="props.isPending"
              />
            </form>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchoolCrestIcon from '@/features/shared/components/SchoolCrestIcon.vue'
const username = defineModel<string>('username')
const password = defineModel<string>('password')
const props = defineProps<{ isPending: boolean; code: string }>()
const emit = defineEmits<{ (e: 'login', value: { code: string }): void }>()

const onLogin = () => emit('login', { code: props.code })
</script>
