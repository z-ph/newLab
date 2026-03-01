<template>
  <Menu ref="menuRef" :model="menuItems" popup>
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center gap-2" v-bind="props.action">
        <i :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
  <ChangePasswordDialog ref="changePasswordDialogRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import ChangePasswordDialog from '../settings/components/ChangePasswordDialog.vue'

// 对话框引用
const changePasswordDialogRef = ref<InstanceType<typeof ChangePasswordDialog>>()

// 菜单项
const menuItems: MenuItem[] = [
  {
    label: '修改密码',
    icon: 'pi pi-key',
    command: () => {
      changePasswordDialogRef.value?.open()
    },
  },
]

// 菜单引用
const menuRef = ref<InstanceType<typeof Menu>>()

// 暴露 toggle 方法
defineExpose({
  toggle: (event: MouseEvent) => menuRef.value?.toggle(event),
})
</script>
