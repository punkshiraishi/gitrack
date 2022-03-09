<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700 flex flex-col space-y-3">
    <Logo />
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <button class="btn mt-2" @click="startTracking">
      Start Tracking
    </button>
  </main>
</template>

<script setup lang="ts">
import { sendMessage } from 'webext-bridge'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function startTracking() {
  await sendMessage('start-tracking', {})
}
</script>
