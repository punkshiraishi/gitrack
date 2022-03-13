<template>
  <select
    :value="modelValue"
    class="p-1 border border-dark-100 rounded-md"
    @change="onChange"
  >
    <option
      v-for="project in projects"
      :key="project.id"
      :value="project"
    >
      {{ project.name }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { ClockifyProject } from '~/api/clockify'

const props = defineProps({
  projects: {
    type: Array as PropType<ClockifyProject[]>,
    default: () => [],
  },
  modelValue: {
    type: Object as PropType<ClockifyProject>,
    required: false,
  },
})

const { projects } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

function onChange(event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    emit('update:modelValue', event.target.value)
  }
}

watch(projects, (item) => {
  if (item.length > 0) {
    emit('update:modelValue', item[0])
  }
})
</script>
