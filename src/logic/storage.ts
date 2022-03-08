import { useStorageLocal } from '~/composables/useStorageLocal'

type Options = {
  gitlabToken: string
}

export const storageOptions = useStorageLocal<Options>(
  'options',
  { gitlabToken: '' },
  { listenToStorageChanges: true },
)
