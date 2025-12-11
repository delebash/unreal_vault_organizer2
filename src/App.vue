<template>
    <v-app>
      <v-app-bar>header</v-app-bar>
      <div class="d-flex flex-1-1-100">
        <Sidebar />
        <v-main class="pl-0 bg-grey" >
          <router-view></router-view>
        </v-main>
      </div>
      <v-footer border="t">footer</v-footer>
    </v-app>
</template>

<script setup>
import Sidebar from '@/components/SideBar.vue'
</script>
