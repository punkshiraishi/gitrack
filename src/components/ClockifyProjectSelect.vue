<template>
  <Listbox
    as="div"
    class="relative"
    :value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <ListboxButton
      as="div"
      class="border border-gray-300 p-1 h-7"
    >
      <ClockifyProjectSelectRow v-if="modelValue" :project="modelValue" />
    </ListboxButton>
    <ListboxOptions as="div" class="absolute w-full m-0 bg-white border border-gray-300 shadow-md shadow-blue-gray-600">
      <ListboxOption
        v-for="project in projects"
        :key="project.id"
        as="div"
        class="cursor-pointer hover:bg-gray-200"
        :value="project"
      >
        <ClockifyProjectSelectRow class="py-1 px-2" :project="project" />
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
}, {
  immediate: true,
})
</script>
