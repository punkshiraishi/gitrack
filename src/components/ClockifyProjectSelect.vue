<template>
  <Listbox
    as="div"
    class="relative"
    :value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <ListboxButton
      as="div"
      class="border border-dark-200 rounded-md p-1 h-7"
    >
      <ClockifyProjectSelectRow v-if="modelValue" :project="modelValue" />
    </ListboxButton>
    <ListboxOptions as="div" class="absolute w-full my-2 p-1 bg-white rounded-md shadow-lg shadow-gray-300">
      <ListboxOption
        v-for="project in projects"
        :key="project.id"
        as="div"
        class="cursor-pointer p-1 rounded hover:bg-gray-200"
        :value="project"
      >
        <ClockifyProjectSelectRow :project="project" />
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import ClockifyProjectSelectRow from './ClockifyProjectSelectRow.vue'
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

watch(projects, (item) => {
  if (item.length > 0) {
    emit('update:modelValue', item[0])
  }
})
</script>
