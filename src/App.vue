<script setup>
import { ref } from 'vue'
import LandingPage from './pages/LandingPage.vue'
import Dashboard from './pages/Dashboard.vue'

const currentPage = ref('landing')
</script>

<template>
  <LandingPage
    v-if="currentPage === 'landing'"
    @go-dashboard="currentPage = 'dashboard'"
  />
  <Dashboard
    v-else
    @go-landing="currentPage = 'landing'"
  />
</template>
