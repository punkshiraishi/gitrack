import { z } from 'zod'
import { useStorageLocal } from '~/composables/useStorageLocal'

export const optionsSchema = z.object({
  gitlabToken: z.string(),
  clockifyToken: z.string(),
  clockifyWorkspace: z.string(),
})

type Options = z.infer<typeof optionsSchema>

export const storageOptions = useStorageLocal<Options>(
  'options',
  {
    gitlabToken: '',
    clockifyToken: '',
    clockifyWorkspace: '',
  },
  { listenToStorageChanges: true },
)
