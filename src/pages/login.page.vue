<script setup lang="ts">
import { useLogin } from '@/features/auth/hooks/useLogin'
import LoginCard from '@/features/auth/components/LoginCard.vue'

const { username, password, isPending, wechatCode, handleLogin } = useLogin()
</script>

<template>
  <LoginCard
    v-model:username="username"
    v-model:password="password"
    :is-pending="isPending"
    :code="wechatCode"
    @login="handleLogin"
  />
</template>
