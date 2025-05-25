import { NuxtPage } from './.nuxt/components';
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/primevue@^3/themes/saga-blue/theme.css'
    }
  ]
})
</script>