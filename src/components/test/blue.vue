<template>
  <div>
    <!-- The button that initially opens the dialog -->
    <v-btn @click="openDialog">Open Custom Window</v-btn>

    <!-- The v-dialog component -->
    <v-dialog
        v-model="dialogVisible"
        :fullscreen="isMaximized"
        :width="dialogWidth"
        :height="dialogHeight"
        :scrim="!isMinimized"
        :persistent="isMinimized"
    >
      <v-card>
        <!-- Custom Title Bar -->
        <v-card-title class="d-flex justify-space-between align-center bg-primary">
          <span class="headline">My Custom Dialog</span>
          <div>
            <!-- Minimize Button -->
            <v-btn icon flat @click="minimizeDialog" size="small">
              <v-icon>mdi-window-minimize</v-icon>
            </v-btn>

            <!-- Maximize/Restore Button -->
            <v-btn icon flat @click="toggleMaximize" size="small">
              <v-icon>{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize' }}</v-icon>
            </v-btn>

            <!-- Close Button -->
            <v-btn icon flat @click="closeDialog" size="small">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <!-- Dialog Content -->
        <v-card-text>
          <p>This is the content of the dialog.</p>
          <v-list>
            <v-list-item v-for="i in 10" :key="i">
              List Item {{ i }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- The "Minimized Taskbar" button (optional) -->
    <v-btn
        v-if="isMinimized"
        class="minimized-taskbar-btn"
        @click="restoreFromMinimize"
        color="info"
        fixed
        bottom
        left
    >
      <v-icon start>mdi-application-outline</v-icon>
      Restored Dialog
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
const isMaximized = ref(false);
const isMinimized = ref(false);
const dialogWidth = ref(500); // Default width when not maximized
const dialogHeight = ref(500); // Default width when not maximized

const openDialog = () => {
  dialogVisible.value = true;
  isMinimized.value = false; // Ensure it's not in a minimized state when opening
};

const closeDialog = () => {
  dialogVisible.value = false;
  isMinimized.value = false;
  isMaximized.value = false;
};

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};

const minimizeDialog = () => {
  // isMinimized.value = true;
//  dialogVisible.value = false; // Hide the dialog from main view
  dialogHeight.value= "50px"
};

const restoreFromMinimize = () => {
  isMinimized.value = false;
  dialogVisible.value = true; // Show the dialog again
};
</script>

<style scoped>
/* Optional: Style for the "taskbar" button when minimized */
.minimized-taskbar-btn {
  /* Position the button fixed at the bottom left of the viewport */
  bottom: 10px;
  left: 10px;
  z-index: 1000; /* Ensure it is above other content */
}
</style>
