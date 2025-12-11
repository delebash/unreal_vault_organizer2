<template>
  <v-navigation-drawer
      border="r"
      permanent
      class="position-sticky"
      :style="{maxHeight: height}"
  >
    <div style="border: 2px solid pink; height: 100%">nav bar</div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useLayout } from 'vuetify'

const { mainStyles } = useLayout()
const height = computed(
    () => `calc(100vh - ${mainStyles.value['--v-layout-top']})`
)
</script>
