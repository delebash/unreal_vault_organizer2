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

    <!--Has to go above nav-bar or it won't stretch across whole app-->
    <Footer></Footer>

    <NavBar></NavBar>


    <!-- Main Content Area -->
    <!-- v-main automatically adjusts padding for all fixed layout components -->
    <v-main>
      <!-- This is where ProductListPage.vue is injected by Vue Router -->
      <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script setup>
import {ref} from 'vue';
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
/* Scoped styles for App.vue if needed, generally minimal here */
</style>
