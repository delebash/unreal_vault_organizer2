<template>
  <div>
    <v-btn @click="openDialog">Open Stateful Window</v-btn>

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
          @resizing="updatePositionAndSave"
          @dragging="updatePositionAndSave"
      >
        <v-card class="fill-height">
          <v-card-title class="d-flex justify-space-between align-center bg-primary custom-handle">
            <span class="headline">Stateful Window</span>
            <div>
              <v-btn icon flat @click="toggleMaximize" size="small">
                <v-icon>{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize' }}</v-icon>
              </v-btn>
              <v-btn icon flat @click="closeDialog" size="small">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <p>This window remembers its position, size, and state in localStorage.</p>
            <p>Try refreshing the page or navigating away and coming back.</p>
          </v-card-text>
        </v-card>
      </DraggableResizableVue>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import DraggableResizableVue from 'draggable-resizable-vue3';

const STORAGE_KEY = 'my-app-window-state';

// State Variables
const dialogVisible = ref(false);
const isMaximized = ref(false);
const x = ref(50);
const y = ref(50);
const width = ref(600);
const height = ref(400);
const previousRect = ref({ x: 50, y: 50, w: 600, h: 400 });

// --- Persistence Logic ---

const saveState = () => {
  const state = {
    isOpen: dialogVisible.value,
    isMax: isMaximized.value,
    x: x.value,
    y: y.value,
    w: width.value,
    h: height.value,
    prevRect: previousRect.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  const storedState = localStorage.getItem(STORAGE_KEY);
  if (storedState) {
    const state = JSON.parse(storedState);
    dialogVisible.value = state.isOpen;
    isMaximized.value = state.isMax;
    x.value = state.x;
    y.value = state.y;
    width.value = state.w;
    height.value = state.h;
    previousRect.value = state.prevRect;
  }
};

// Load state when the component mounts
onMounted(loadState);

// Watch for changes in visibility to persist the main open/close state immediately
watch(dialogVisible, saveState);


// --- Interaction Handlers ---

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  // State is automatically saved via the watch effect above
};

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;

  if (isMaximized.value) {
    previousRect.value = { x: x.value, y: y.value, w: width.value, h: height.value };
    // Maximize logic
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
  saveState(); // Save state after maximizing/restoring
};

const updatePositionAndSave = (newRect) => {
  if (!isMaximized.value) {
    x.value = newRect.left;
    y.value = newRect.top;
    width.value = newRect.width;
    height.value = newRect.height;
    previousRect.value = { x: newRect.left, y: newRect.top, w: newRect.width, h: newRect.height };
    saveState(); // Save state after drag/resize finishes
  }
}
</script>

<style>
/* ... (Keep the CSS styles from the previous response) ... */
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
  cursor: grab;
}
.fill-height {
  height: 100%;
}
</style>
