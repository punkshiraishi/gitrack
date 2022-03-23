<template>
  <main class="w-[400px] px-4 pt-5 pb-20 text-center text-gray-700 flex flex-col space-y-5">
    {{ error }}
    <button class="bg-gray-300 self-end py-1 px-2 rounded-sm" @click="openOptionsPage">
      Open Options
    </button>
    <div class="h-[200px] flex flex-col space-y-3">
      <template v-if="loading">
        <div class="h-full w-full flex justify-center items-center">
          <LoadingDot />
        </div>
      </template>
      <template v-else>
        <div class="h-full w-full flex flex-col space-y-3">
          <div class="flex flex-col space-y-1 items-start">
            <div class="text-sky-500">
              Timeentry
            </div>
            <input
              v-model="description"
              class="w-full p-1 border border-gray-300"
              type="text"
            >
          </div>
          <template v-if="clockifyProjects.length > 0">
            <div class="flex flex-col space-y-1 items-start">
              <div class="text-sky-500">
                Clockify Project Name
              </div>
              <ClockifyProjectSelect
                v-model="selectedClockifyProject"
                class="w-full"
                :projects="clockifyProjects"
              />
            </div>
          </template>
          <template v-else>
            <div class="flex flex-row space-x-2">
              <input
                value="新しいプロジェクトの名前"
                class="p-1 border border-gray-300"
                type="text"
              >
              <button class="bg-gray-300 self-end py-1 px-2 rounded">
                Create Project
              </button>
            </div>
          </template>
        </div>
        <button
          class="bg-sky-500 text-white p-2 font-bold"
          :disabled="starting"
          @click="startTracking"
        >
          {{ starting ? 'Starting' : 'Start Tracking' }}
        </button>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { sendMessage } from 'webext-bridge'
import { ClockifyProject } from '~/api/clockify'
import ClockifyProjectSelect from '~/components/ClockifyProjectSelect.vue'
import LoadingDot from '~/components/LoadingDot.vue'

const description = ref('')
const clockifyProjects = ref<ClockifyProject[]>([])
const selectedClockifyProject = ref<ClockifyProject>()
const loading = ref(true)
const starting = ref(false)
const error = ref()

onMounted(async() => {
  try {
    const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true })
    const url = tabs[0].url

    if (url) {
      const projectName = url.match(/\/([^\/]+)\/-\/(issues|merge_requests)/)?.[1]

      if (projectName) {
        clockifyProjects.value = await sendMessage('get-clockify-projects', {
          projectName,
        })
      }

      const projectNameWithNamespace = url
        .match(/^https?:\/{2,}.*?\/(.*)\/-\/(issues|merge_requests)/)?.[1]

      const issueId = url.match(/\/-\/issues\/(\d+)/)?.[1]

      if (issueId && projectNameWithNamespace) {
        const response = await sendMessage('get-issue-name', {
          issueId,
          projectNameWithNamespace,
        })

        description.value = `#${issueId} ${response.issueName}`
      }

      const mergeRequestId = url.match(/\/-\/merge_requests\/(\d+)/)?.[1]

      if (mergeRequestId && projectNameWithNamespace) {
        const response = await sendMessage('get-merge-request-name', {
          mergeRequestId,
          projectNameWithNamespace,
        })

        description.value = `!${mergeRequestId} ${response.mergeRequestName}`
      }
    }
  }
  catch (e) {
    error.value = e
  }
  finally {
    loading.value = false
  }
})

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function startTracking() {
  starting.value = true
  if (selectedClockifyProject.value) {
    await sendMessage('start-timetracking', {
      description: description.value,
      clockifyProjectId: selectedClockifyProject.value.id,
    }).finally(() => starting.value = false)
  }
}

</script>
