<!-- DialogWindow.vue -->
<template>
  <div v-resize="onResizeHandler">
    <!-- We might render this in a loop if we wanted multiple independent windows -->
    <div v-if="modelValue">
      <v-dialog ref="refDialog"
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
                content-class="custom-dialog-wrapper"
                :scrim="false"
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
          v-model:active="isActive"
          :handles="['tl', 'tr', 'bl', 'br', 'tm', 'bm', 'ml', 'mr']"
          class="custom-window-style"
          @dragstop="updatePosition"
          @resizestop="updatePosition"
        >

          <v-card class="fill-height">
            <v-card-title ref="refDialogTitle"
                          class="d-flex justify-space-between align-center bg-primary custom-handle">
              <!-- Header Slot -->
              <slot name="header">
                <span class="text-h5">{{ title }}</span>
              </slot>
              <div>
                <!-- Recenter -->
                <v-btn class="mr-1" icon flat @click="reCenter" size="x-small">
                  <v-icon>mdi-format-horizontal-align-center</v-icon>
                </v-btn>

                <!-- Minimize Button -->
                <v-btn class="mr-1" icon flat @click="toggleMinimize" size="x-small">
                  <v-icon>mdi-window-minimize</v-icon>
                </v-btn>

                <!-- Maximize/Restore Button -->
                <v-btn class="mr-1" icon flat @click="toggleMaximize" size="x-small">
                  <v-icon>{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize' }}</v-icon>
                </v-btn>

                <!-- Close Button -->
                <v-btn icon flat size="x-small" @click="$emit('update:modelValue', false)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card-title>

            <!-- Body Slot -->
            <v-card-text>
              <slot name="body">
                <!-- Default body content if none provided -->
                This is the main content of the dialog.
                x {{ x }}
                y {{ y }}
              </slot>
            </v-card-text>

            <!-- Actions Slot -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <slot name="actions">
                <!-- Default actions if none provided -->
                <v-btn color="primary" @click="$emit('update:modelValue', false)">
                  Close
                </v-btn>
              </slot>
            </v-card-actions>
          </v-card>
        </DraggableResizableVue>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import DraggableResizableVue from "draggable-resizable-vue3";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: String,
  lastPosition: {
    type: Boolean,
    default: false
  },
  dialogWidth: {
    type: Number,
    default: 600
  },
  dialogHeight: {
    type: Number,
    default: 400
  },
});

// Internal dialog state, synchronized with the parent's modelValue prop
// const dialogVisible = ref(props.modelValue);

defineEmits(['update:modelValue']);

const STORAGE_KEY = 'last-dialog-position-and-state';
const isMaximized = ref(false);
const isMinimized = ref(false); // New state for minimize
const x = ref(0);
const y = ref(0);
const dialogWidth = ref(props.dialogWidth);
const dialogHeight = ref(props.dialogHeight);
const isActive = ref(false);
const refDialogTitle = ref(null);
const refDialog = ref(null)

// Define internal methods to run on open/close
const runOnOpen = () => {
  createNewDialog(props.lastPosition)
  console.log('*** Internal Dialog Method: Dialog is now open! ***');
  // e.g., fetch data specific to the dialog content, reset a form, etc.
};

const runOnClose = () => {
  saveDialogPosition(); // Save final position before close
  isMinimized.value = false;
  console.log('*** Internal Dialog Method: Dialog is now closed! ***');
  // e.g., clean up resources, clear a local state, etc.
};

const createNewDialog = (lastPosition) => {
  if (lastPosition) {
    loadLastPosition();
  }
  isMinimized.value = false; // Ensure minimized state is false when opening
};

const onResizeHandler = () => {
  if (isMaximized.value) {
    dialogWidth.value = (window.innerWidth - 15)
    dialogHeight.value = (window.innerHeight - 10)
  }
};

const updatePosition = (left, top, width, height) => {
  // Update internal state during dragging/resizing only if not maximized
  if (!isMaximized.value) {
    dialogWidth.value = width !== undefined ? width : dialogWidth.value;
    dialogHeight.value = height !== undefined ? height : dialogHeight.value;
    x.value = left !== undefined ? left : x.value;
    y.value = top !== undefined ? top : y.value;
  }
};

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
  if (isMaximized.value) {
    //Save current state
    saveDialogPosition()
    // Maximize: set to full viewport size
    x.value = 0;
    y.value = 0;
    dialogWidth.value = (window.innerWidth - 15)
    dialogHeight.value = (window.innerHeight - 10)
  } else {
    // Restore previous state
    loadLastPosition();
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (isMinimized.value) {
    saveDialogPosition()
    dialogHeight.value = refDialogTitle.value.$el.offsetHeight;
  } else {
    const storedPos = localStorage.getItem(STORAGE_KEY);
    if (storedPos) {
      const pos = JSON.parse(storedPos);
      dialogHeight.value = pos.h
    }
  }
};


// --- Persistence Logic ---
const saveDialogPosition = () => {
  const position = {
    x: x.value,
    y: y.value,
    w: dialogWidth.value,
    h: dialogHeight.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
};

const loadLastPosition = () => {
  const storedPos = localStorage.getItem(STORAGE_KEY);
  if (storedPos) {
    const pos = JSON.parse(storedPos);
    x.value = pos.x;
    y.value = pos.y;
    dialogWidth.value = pos.w;
    dialogHeight.value = pos.h;
  }
};

// Function to center dialog
const reCenter = () => {
  x.value = 0
  y.value = 0
  dialogWidth.value = props.dialogWidth
  dialogHeight.value = props.dialogHeight
};

// Use a watcher on the prop to trigger these methods
watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    // Dialog is opening
    runOnOpen();
  } else if (newValue === false && oldValue === true) {
    // Dialog is closing
    runOnClose();
  }
});

</script>
<style>

/* Essential styling to make the dialog interact correctly with the draggable wrapper */
.custom-dialog-wrapper {
  overflow: visible !important; /* Allows resize handles to be visible */
  display: flex; /* Ensures proper centering/positioning */
  align-items: center;
  justify-content: center;
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

</style>
