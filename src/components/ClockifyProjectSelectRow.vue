<template>
  <div class="flex flex-row justify-between">
    <div
      class="font-bold"
      :style="{ color: project.color }"
    >
      {{ project.name }}
    </div>
    <div>
      {{ project.clientName }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { ClockifyProject } from '~/api/clockify'

defineProps({
  project: {
    type: Object as PropType<ClockifyProject>,
    required: true,
  },
})
</script>
