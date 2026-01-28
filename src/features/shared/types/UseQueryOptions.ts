import type { Ref } from "vue";

export interface QueryOptions {
  queryKey: Ref<unknown[]> | unknown[];
  enable?: boolean|(() => boolean);
}