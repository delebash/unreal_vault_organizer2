
<template>
  <v-container>
    <v-btn @click="dialog = true">Open Window Dialog</v-btn>

    <!-- The v-dialog component acts as the window container -->
    <!-- We use a dynamic class to manage the maximized state -->
    <v-dialog
        v-model="dialog"
        :content-class="isMaximized ? 'window-dialog-maximized' : 'window-dialog-normal'"
        persistent
        scrollable
        :width="isMaximized ? '100%' : initialWidth"
    >
      <v-card class="window-card">
        <!-- Window Title Bar/Header -->
        <v-card-title class="window-header d-flex justify-space-between align-center">
          <span class="text-h6">Custom Window</span>
          <div>
            <!-- Minimize Button (closes dialog for simplicity as actual minimize to taskbar is OS dependent) -->
            <v-btn icon size="small" variant="text" @click="dialog = false">
              <v-icon>mdi-minus</v-icon>
            </v-btn>

            <!-- Maximize/Restore Button -->
            <v-btn icon size="small" variant="text" @click="toggleMaximize">
              <v-icon>{{ isMaximized ? 'mdi-restore' : 'mdi-plus' }}</v-icon>
            </v-btn>

            <!-- Close Button -->
            <v-btn icon size="small" variant="text" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <!-- Window Content Area -->
        <v-card-text style="height: 300px;">
          <p>This is the content area. The dialog uses dynamic width and height based on the maximized state.</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
const isMaximized = ref(false);
const initialWidth = '600px'; // Set your preferred initial width

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};
</script>

<style>
/* Custom CSS to style the dialog as a window */
.window-dialog-normal {
  border-radius: 8px;
  overflow: hidden; /* Ensures card corners match dialog corners */
}

.window-dialog-maximized {
  /* Remove border radius for fullscreen look */
  border-radius: 0;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
}

.window-card {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensures the card fills the dialog space */
}

.window-header {
  /* Add drag handle styling for potential future custom drag logic */
  cursor: grab;
  background-color: #f5f5f5; /* Light gray header */
  border-bottom: 1px solid #ddd;
}
</style>
