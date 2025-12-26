<template>
  <div v-resize="onResizeHandler">
    <!-- Button to open a new instance -->
    <!--    <v-btn @click="createNewDialog">Open Another Dialog Instance</v-btn>-->

    <!-- We might render this in a loop if we wanted multiple independent windows -->
    <div v-if="dialogVisible">
      <v-dialog
          content-class="custom-dialog-wrapper"
          v-model="dialogVisible"
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
            <v-card-title class="d-flex justify-space-between align-center bg-primary custom-handle">
              <span class="text-h5">{{ title }}</span>
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
              <!-- This is the default slot where the form data content will be injected -->
              <slot></slot>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                {{ optionalSave ? 'Close' : 'Cancel' }}
              </v-btn>

              <!-- Conditionally rendered save button -->
              <v-btn v-if="!optionalSave" color="blue-darken-1" variant="text" @click="saveForm">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </DraggableResizableVue>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import DraggableResizableVue from 'draggable-resizable-vue3';

const STORAGE_KEY = 'last-dialog-position-and-state';
// State Variables
// const dialogVisible = ref(false);

const props = defineProps({
  modelValue: Boolean,
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
  // New prop to make the save button optional (default is false, so it shows by default)
  optionalSave: {
    type: Boolean,
    default: false,
  },
});


const isMaximized = ref(false);
const isMinimized = ref(false); // New state for minimize
const x = ref(300);
const y = ref(-200);
const dialogWidth = ref(props.dialogWidth);
const dialogHeight = ref(props.dialogHeight);
const isActive = ref(false);


const emit = defineEmits(['save', 'close']);

// Internal dialog state, synchronized with the parent's modelValue prop
const dialogVisible = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    createNewDialog(props.lastPosition)
  } else {
    closeDialog();
  }
});

function open() {
  createNewDialog(props.lastPosition)
}

function close() {
  //     dialogVisible.value = false
}

const createNewDialog = (lastPosition) => {
  if (lastPosition) {
    loadLastPosition();
  }
  dialogVisible.value = true;
  isMinimized.value = false; // Ensure minimized state is false when opening
};

const onResizeHandler = () => {
  if (isMaximized.value) {
    dialogWidth.value = (window.innerWidth - 15)
    dialogHeight.value = (window.innerHeight - 10)
  }
};

const closeDialog = () => {
  // saveDialogPosition(); // Save final position before close
  // isMinimized.value = false;
  // isMaximized.value = false;
  dialogVisible.value = false;
  emit('close');
  // dialogVisible.value = false;
};

function saveForm() {
  // Emit a 'save' event to the parent component
  emit('save');
}

const updatePosition = (left, top, width1, height1) => {
  // Update internal state during dragging/resizing only if not maximized
  if (!isMaximized.value) {
    dialogWidth.value = width1 !== undefined ? width1 : dialogWidth.value;
    dialogHeight.value = height1 !== undefined ? height1 : dialogHeight.value;
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

const minimizeDialog = () => {
  isMinimized.value = true;
  //dialogVisible.value = false; // Hide the dialog from main view
};

const restoreFromMinimize = () => {
  isMinimized.value = false;
  dialogVisible.value = true; // Show the dialog again
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
