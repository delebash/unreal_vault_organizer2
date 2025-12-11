<template>
  <v-container>
    <v-btn @click="openDialog">Open Window Dialog</v-btn>

    <!-- The v-dialog component acts as the window container -->
    <!-- We use a dynamic class to manage the maximized state -->
    <v-dialog
        v-model="dialogVisible"
        :persistent="isPersistent"
        :scrollable="isScrollable"
        :fullscreen="isMaximized"
        :width="dialogWidth"
        :height="dialogHeight"
        :scrim="false"
        content-class="v-dialog-draggable-resizble"
        max-width="none"
        max-height="none"
        persistent
        no-click-animation
    >
      <DraggableResizableVue
          v-model:x="x"
          v-model:y="y"
          v-model:w="dialogWidth"
          v-model:h="dialogHeight"
          :draggable="!isMaximized"
          :resizable="!isMaximized"
          :handles="['tl', 'tr', 'bl', 'br', 'tm', 'bm', 'ml', 'mr']"
          class="custom-window-style"
          @dragging="updatePosition"
          @resizing="updatePosition"
      >
      <v-card class="window-card">
        <!-- Window Title Bar/Header -->
        <v-card-title class="window-header d-flex justify-space-between align-center bg-primary">
          <span class="text-h6">Custom Window</span>
          <div>
            <v-btn icon size="small" variant="text" @click="minimizeDialog">
              <v-icon>mdi-minus</v-icon>
            </v-btn>

            <!-- Maximize/Restore Button -->
            <v-btn icon size="small" variant="text" @click="toggleMaximize">
              <v-icon>{{ isMaximized ? 'mdi-restore' : 'mdi-plus' }}</v-icon>
            </v-btn>

            <!-- Close Button -->
            <v-btn icon size="small" variant="text" @click="closeDialog">
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

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text="Close" @click="closeDialog"></v-btn>
        </v-card-actions>
      </v-card>
      </DraggableResizableVue>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import DraggableResizableVue from "draggable-resizable-vue3";

const STORAGE_KEY = 'last-dialog-position-and-state';
const dialogVisible = ref(false);
const isPersistent = ref(true);
const isScrollable = ref(true);
const isMaximized = ref(false);
const isMinimized = ref(false);
// const dialogWidth = ref(null); // Default width when not maximized
// const dialogHeight = ref(null); // Default width when not maximized
// const initialWidth = '600'; // Set your preferred initial width
// const initialHeight = '600'; // Set your preferred initial width

const x = ref(50);
const y = ref(50);
const dialogWidth = ref(600);
const dialogHeight = ref(400);
const previousRect = ref({ x: 50, y: 50, w: 600, h: 400 });

const openDialog = () => {
  loadLastPosition();
  dialogVisible.value = true;
  isMinimized.value = false; // Ensure it's not in a minimized state when opening
};

const closeDialog = () => {
  saveDialogPosition(); // Save final position before close
  dialogVisible.value = false;
  isMinimized.value = false;
  isMaximized.value = false;
};

const minimizeDialog = () => {
  isMinimized.value = true;
  isMaximized.value = false;
//  dialogVisible.value = false; // Hide the dialog from main view
  dialogHeight.value = "50"
};

const restoreFromMinimize = () => {
  isMinimized.value = false;
  dialogVisible.value = true; // Show the dialog again
};

// const toggleMaximize = () => {
//   isMaximized.value = !isMaximized.value;
// };

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;

  if (isMaximized.value) {
    previousRect.value = { x: x.value, y: y.value, w: width.value, h: height.value };
    // Maximize: set to full viewport size
    x.value = 0;
    y.value = 0;
    dialogWidth.value = window.innerWidth;
    dialogHeight.value = window.innerHeight;
  } else {
    // Restore logic
    x.value = previousRect.value.x;
    y.value = previousRect.value.y;
    dialogWidth.value = previousRect.value.w;
    dialogHeight.value = previousRect.value.h;
  }
};


const updatePosition = (newRect) => {
  // Update internal state during dragging/resizing only if not maximized
  if (!isMaximized.value) {
    x.value = newRect.left;
    y.value = newRect.top;
    dialogWidth.value = newRect.width;
    dialogHeight.value = newRect.height;
  }
};

// --- Persistence Logic ---
const saveDialogPosition = () => {
  // We save the 'previousRect' because that stores the intended 'restored' position/size
  localStorage.setItem(STORAGE_KEY, JSON.stringify(previousRect.value));
};

const loadLastPosition = () => {
  const storedPos = localStorage.getItem(STORAGE_KEY);
  if (storedPos) {
    const pos = JSON.parse(storedPos);
    x.value = pos.x;
    y.value = pos.y;
    dialogWidth.value = pos.w;
    dialogHeight.value = pos.h;
    previousRect.value = pos; // Load into previousRect as well
  }
};
</script>

<style>

.v-dialog-draggable-resizble {
  margin: 0 !important;
  position: fixed !important;
  transition: none !important;
  height: auto;
  width: auto;
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


<!--<template>-->
<!--  <v-container>-->
<!--    <v-btn @click="dialog = true">Open Window Dialog</v-btn>-->

<!--    &lt;!&ndash; The v-dialog component acts as the window container &ndash;&gt;-->
<!--    &lt;!&ndash; We use a dynamic class to manage the maximized state &ndash;&gt;-->
<!--    <v-dialog-->
<!--        v-model="dialog"-->
<!--        :content-class="isMaximized ? 'window-dialog-maximized' : 'window-dialog-normal'"-->
<!--        persistent-->
<!--        scrollable-->
<!--        :width="isMaximized ? '100%' : initialWidth"-->
<!--    >-->
<!--      <v-card class="window-card">-->
<!--        &lt;!&ndash; Window Title Bar/Header &ndash;&gt;-->
<!--        <v-card-title class="window-header d-flex justify-space-between align-center">-->
<!--          <span class="text-h6">Custom Window</span>-->
<!--          <div>-->
<!--            &lt;!&ndash; Minimize Button (closes dialog for simplicity as actual minimize to taskbar is OS dependent) &ndash;&gt;-->
<!--            <v-btn icon size="small" variant="text" @click="dialog = false">-->
<!--              <v-icon>mdi-minus</v-icon>-->
<!--            </v-btn>-->

<!--            &lt;!&ndash; Maximize/Restore Button &ndash;&gt;-->
<!--            <v-btn icon size="small" variant="text" @click="toggleMaximize">-->
<!--              <v-icon>{{ isMaximized ? 'mdi-restore' : 'mdi-plus' }}</v-icon>-->
<!--            </v-btn>-->

<!--            &lt;!&ndash; Close Button &ndash;&gt;-->
<!--            <v-btn icon size="small" variant="text" @click="dialog = false">-->
<!--              <v-icon>mdi-close</v-icon>-->
<!--            </v-btn>-->
<!--          </div>-->
<!--        </v-card-title>-->

<!--        &lt;!&ndash; Window Content Area &ndash;&gt;-->
<!--        <v-card-text style="height: 300px;">-->
<!--          <p>This is the content area. The dialog uses dynamic width and height based on the maximized state.</p>-->
<!--        </v-card-text>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
<!--  </v-container>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref } from 'vue';-->

<!--const dialog = ref(false);-->
<!--const isMaximized = ref(false);-->
<!--const initialWidth = '600px'; // Set your preferred initial width-->

<!--const toggleMaximize = () => {-->
<!--  isMaximized.value = !isMaximized.value;-->
<!--};-->
<!--</script>-->

<!--<style>-->
<!--/* Custom CSS to style the dialog as a window */-->
<!--.window-dialog-normal {-->
<!--  border-radius: 8px;-->
<!--  overflow: hidden; /* Ensures card corners match dialog corners */-->
<!--}-->

<!--.window-dialog-maximized {-->
<!--  /* Remove border radius for fullscreen look */-->
<!--  border-radius: 0;-->
<!--  height: 100vh;-->
<!--  max-height: 100vh;-->
<!--  margin: 0;-->
<!--}-->

<!--.window-card {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  height: 100%; /* Ensures the card fills the dialog space */-->
<!--}-->

<!--.window-header {-->
<!--  /* Add drag handle styling for potential future custom drag logic */-->
<!--  cursor: grab;-->
<!--  background-color: #f5f5f5; /* Light gray header */-->
<!--  border-bottom: 1px solid #ddd;-->
<!--}-->
<!--</style>-->
