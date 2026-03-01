import { useMutation } from '@tanstack/vue-query'
import { postApiAuthSetPassword } from '@/core/api/generated'
import type { SetPasswordRequest } from '@/core/api/generated'
import client from '@/core/api/config'

export type ChangePasswordFormData = SetPasswordRequest

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      postApiAuthSetPassword({
        body: data,
        client,
      }),
  })
}
