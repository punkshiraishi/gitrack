<template>
  <main class="w-[400px] px-4 pt-5 pb-20 text-center text-gray-700 flex flex-col space-y-5">
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
        <template v-if="clockifyProjects.length > 0">
          <input
            v-model="description"
            class="p-1 border border-gray-300"
            type="text"
          >
          <ClockifyProjectSelect
            v-model="selectedClockifyProject"
            :projects="clockifyProjects"
          />
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
        <button class="btn" @click="startTracking">
          Start Tracking
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

const issueId = ref('')
const projectName = ref('')
const issueName = ref('')
const description = ref('')
const clockifyProjects = ref<ClockifyProject[]>([])
const selectedClockifyProject = ref<ClockifyProject>()
const loading = ref(true)

onMounted(async() => {
  try {
    const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true })
    const url = tabs[0].url

    if (url) {
      const matchedIssueId = url.match(/\/-\/issues\/(\d+)/)

      if (matchedIssueId) {
        issueId.value = matchedIssueId[1]
      }

      const machedProjectName = url.match(/\/([^\/]+)\/-\/issues/)

      if (machedProjectName) {
        projectName.value = machedProjectName[1]
        clockifyProjects.value = await sendMessage('get-clockify-projects', {
          projectName: projectName.value,
        })
      }

      if (matchedIssueId && machedProjectName) {
        const response = await sendMessage('get-issue-name', {
          issueId: matchedIssueId[1],
          projectName: machedProjectName[1],
        })

        if (response.issueName) {
          issueName.value = response.issueName
        }

        description.value = `#${issueId.value} ${issueName.value}`
      }
    }
  }
  finally {
    loading.value = false
  }
})

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function startTracking() {
  if (selectedClockifyProject.value) {
    await sendMessage('start-timetracking', {
      description: description.value,
      clockifyProjectId: selectedClockifyProject.value.id,
    })
  }
}

</script>
