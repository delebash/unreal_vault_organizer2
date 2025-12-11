<script setup>
import { invoke } from "@tauri-apps/api/core";
import { ref} from 'vue';
import AppFooter from "@/components/AppFooter.vue";

const drawer=ref(false);

</script>
<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Application</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer permanent>
      <v-list nav dense>
        <!-- Navigation items go here -->
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
    <AppFooter  />
  </v-app>

</template>
<style>
</style>
