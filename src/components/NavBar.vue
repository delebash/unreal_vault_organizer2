<template>
  <!-- Navigation Drawer (Sidebar) -->
  <v-navigation-drawer
      v-model="drawer"
      location="left"
      border="r"
      permanent
      fixed
      :style="{maxHeight: height}"
  >
    <v-list nav dense>
      <v-list-item link to="/" title="Home" prepend-icon="mdi-home"></v-list-item>
      <v-list-item link to="/products" title="Products" prepend-icon="mdi-store"></v-list-item>
      <v-list-item link to="/about" title="About Us" prepend-icon="mdi-information"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import {computed, ref} from 'vue'
import { useLayout } from 'vuetify'
const drawer = ref(true); // Set to true for permanent, use false for toggleable
const { mainStyles } = useLayout()
const height = computed(
    () => `calc(100vh - ${mainStyles.value['--v-layout-top']})`
)
</script>
