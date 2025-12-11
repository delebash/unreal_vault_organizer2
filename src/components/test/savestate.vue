

<template>
  <div>
    <!-- Button to open a new instance -->
    <v-btn @click="createNewDialog">Open Another Dialog Instance</v-btn>

    <!-- We might render this in a loop if we wanted multiple independent windows -->
    <div v-if="dialogVisible">
      <v-dialog
          v-model="dialogVisible"
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
            v-model:w="width"
            v-model:h="height"
            :draggable="!isMaximized"
            :resizable="!isMaximized"
            :handles="['tl', 'tr', 'bl', 'br', 'tm', 'bm', 'ml', 'mr']"
            class="custom-window-style"
            @dragging="updatePosition"
            @resizing="updatePosition"
        >
          <v-card class="fill-height">
            <v-card-title class="d-flex justify-space-between align-center bg-primary custom-handle">
              <span class="headline">Fully Featured Window</span>
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
            <v-card-text>
              <p>Drag the title bar, resize using corners, or use the top-right controls.</p>
            </v-card-text>
          </v-card>
        </DraggableResizableVue>
      </v-dialog>
    </div>

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
import DraggableResizableVue from 'draggable-resizable-vue3';

const STORAGE_KEY = 'last-dialog-position-and-state';

// State Variables
const dialogVisible = ref(false);
const isMaximized = ref(false);
const isMinimized = ref(false); // New state for minimize
const x = ref(50);
const y = ref(50);
const width = ref(600);
const height = ref(400);
const previousRect = ref({ x: 50, y: 50, w: 600, h: 400 });

// --- Interaction Handlers ---

const createNewDialog = () => {
  // Load position data from the last *closed* window before showing the new one
  loadLastPosition();
  dialogVisible.value = true;
  isMinimized.value = false; // Ensure minimized state is false when opening
};

const closeDialog = () => {
  saveDialogPosition(); // Save final position before close
  dialogVisible.value = false;
  isMinimized.value = false;
  isMaximized.value = false;
};

const updatePosition = (newRect) => {
  // Update internal state during dragging/resizing only if not maximized
  if (!isMaximized.value) {
    x.value = newRect.left;
    y.value = newRect.top;
    width.value = newRect.width;
    height.value = newRect.height;
  }
};

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;

  if (isMaximized.value) {
    previousRect.value = { x: x.value, y: y.value, w: width.value, h: height.value };
    // Maximize: set to full viewport size
    x.value = 0;
    y.value = 0;
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  } else {
    // Restore logic
    x.value = previousRect.value.x;
    y.value = previousRect.value.y;
    width.value = previousRect.value.w;
    height.value = previousRect.value.h;
  }
};

const minimizeDialog = () => {
  isMinimized.value = true;
  dialogVisible.value = false; // Hide the dialog from main view
};

const restoreFromMinimize = () => {
  isMinimized.value = false;
  dialogVisible.value = true; // Show the dialog again
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
    width.value = pos.w;
    height.value = pos.h;
    previousRect.value = pos; // Load into previousRect as well
  }
};
</script>

<style>
/*
  Crucial CSS: Ensure the default v-dialog container doesn't conflict
  with the positioning managed by draggable-resizable-vue3
*/
.v-dialog-draggable-resizble {
  margin: 0 !important;
  position: fixed !important;
  transition: none !important;
  height: auto;
  width: auto;
}

.custom-window-style {
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.custom-handle {
  cursor: grab; /* Changes cursor to indicate draggability */
}

.fill-height {
  height: 100%;
}

.minimized-taskbar-btn {
  /* Style for the "taskbar" button when minimized */
  bottom: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
