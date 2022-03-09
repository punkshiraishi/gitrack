<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 space-y-3">
    <pixelarticons-sliders class="icon-btn mx-2 text-2xl" />
    <div>Options</div>
    <div class="flex flex-col items-center">
      <div class="flex flex-row items-center space-x-3">
        <div class="w-[100px]">
          Clocify Token
        </div>
        <input v-model="storageOptions.clockifyToken" class="border border-gray-400 rounded px-2 py-1 mt-2" />
      </div>
      <div class="flex flex-row items-center space-x-3">
        <div class="w-[100px]">
          Clocify Workspace
        </div>
        <input v-model="storageOptions.clockifyWorkspace" class="border border-gray-400 rounded px-2 py-1 mt-2" />
      </div>
      <div class="flex flex-row items-center space-x-3">
        <div class="w-[100px]">
          Gitlab Token
        </div>
        <input v-model="storageOptions.gitlabToken" class="border border-gray-400 rounded px-2 py-1 mt-2" />
      </div>
    </div>
    <div class="mt-4">
      Powered by Vite <pixelarticons-zap class="align-middle" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { storageOptions } from '~/logic/storage'
</script>
