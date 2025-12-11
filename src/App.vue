<template>
  <v-app>
    <!-- System Bar (Topmost bar) -->
    <v-system-bar color="primary" lights-out>
      <v-icon icon="mdi-wifi-strength-4"></v-icon>
      <v-spacer></v-spacer>
      <v-icon icon="mdi-clock"></v-icon>
      <span>12:30 PM</span>
    </v-system-bar>

    <!-- App Bar (Header) -->
    <v-app-bar color="teal-darken-4" flat>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>My E-Commerce Store</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-cart"></v-btn>
    </v-app-bar>

    <!--    Side Nav-->
    <NavBar></NavBar>

    <!-- Main Content Area -->
    <!-- v-main automatically adjusts padding for all fixed layout components -->
    <v-main>
      <!-- This is where ProductListPage.vue is injected by Vue Router -->
      <router-view></router-view>
    </v-main>

    <!--    Global footer-->
    <v-footer
        color="grey"
        height="44"
        app
    ></v-footer>
  </v-app>
</template>

<script setup>
import {ref} from 'vue';
import NavBar from "@/components/NavBar.vue";
</script>

<style scoped>
/* Scoped styles for App.vue if needed, generally minimal here */
</style>
