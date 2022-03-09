<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <button class="btn mt-2" @click="reloadIssues">
      Reload Issues
    </button>
    <button class="btn mt-2" @click="check">
      check Issues
    </button>
  </main>
</template>

<script setup lang="ts">
/* eslint-disable no-console */
import { sendMessage } from 'webext-bridge'
import { useStorageLocal } from '~/composables/useStorageLocal';

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const response = ref([])

const issues = computed(() => {
  const issues = useStorageLocal('issues', [])
  console.log('issues', issues.value)
  return issues
})

async function reloadIssues() {
  response.value = await sendMessage('reload-issues', {})
}

const issuesHere = useStorageLocal('issues', [])

async function check() {
  console.log('check', await browser.storage.local.get())
  console.log('issues', issuesHere.value)
}
</script>
