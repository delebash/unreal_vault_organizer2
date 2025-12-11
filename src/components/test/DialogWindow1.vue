<template>
  <div>
    <!-- Button to open a new instance -->
    <v-btn @click="createNewDialog">Open Another Dialog Instance</v-btn>

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
                x={{ x }}<br/>
                y={{ y }}<br/>
                height={{ dialogHeight }}<br/>
                width={{ dialogWidth }}<br/>
                isActive={{ isActive }}
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
import {ref, onMounted} from 'vue';
import {useDisplay} from 'vuetify';
import {computed} from 'vue';

const {width, height, mobile} = useDisplay();
const windowSize = computed(() => ({
  width: width.value,
  height: height.value,
}));
console.log(windowSize.value);
import {useLayout} from 'vuetify'

const {getLayoutItem} = useLayout()
const appLayoutSize = ref(null)
import DraggableResizableVue from 'draggable-resizable-vue3';

const STORAGE_KEY = 'last-dialog-position-and-state';
// console.log(getLayoutItem)
// State Variables
const dialogVisible = ref(false);
const isMaximized = ref(false);
const isMinimized = ref(false); // New state for minimize
const x = ref(300);
const y = ref(-200);
const dialogWidth = ref(600);
const dialogHeight = ref(400);
const isActive = ref(false);

onMounted(() => {
  // console.log(theight)
  // Access the v-app element
  // const appElement = this.$refs.myApp.$el;
  //
  // // Get its width and height
  // const appWidth = appElement.clientWidth;
  // const appHeight = appElement.clientHeight;
  //
  // console.log('v-app width:', appWidth);
  // console.log('v-app height:', appHeight);
  // appLayoutSize.value = getLayoutItem('myAppLayout')
  // console.log('v-app layout size:', appLayoutSize.value)
  // appLayoutSize.value will contain properties like 'height', 'width', 'top', 'left', etc.
})

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

const updatePosition = (left, top, width1, height1) => {
  console.log(left, top, width1, height1);
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
    // previousRect.value = {x: x.value, y: y.value, w: width.value, h: height.value};
    // Maximize: set to full viewport size
    x.value = 0;
    y.value = 0;
    dialogWidth.value = (window.innerWidth - 15)
    dialogHeight.value = (window.innerHeight -10)
    // } else {
    // Restore logic
    // x.value = previousRect.value.x;
    // y.value = previousRect.value.y;
    // width.value = previousRect.value.w;
    // height.value = previousRect.value.h;
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

.draggable-dialog-content {
  background: white; /* Ensure background color when not using v-card as main wrapper */
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}


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
