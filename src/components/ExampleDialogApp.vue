<!-- App.vue -->
<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>Main Application</h1>

        <!-- The button sets the state via the computed property setter -->
        <v-btn color="primary" @click="openDialog">
          Open Dialog from App
        </v-btn>

        <!-- Bind v-model directly to the reactive ref 'dialogVisible' -->
        <!--        <ComponentA v-model="dialogVisible"/>-->
        <!-- Button in App.vue to control visibility -->
        <v-btn color="primary" @click="openDialog">
          Open Dialog
        </v-btn>

        <!-- Use ReusableDialog directly, customizing its slots here -->
        <!--        <ReusableDialog-->
        <!--          v-model="dialogVisible"-->
        <!--          title="Are you sure you want to close?"-->
        <!--        >-->

        <!--          &lt;!&ndash; Custom Header Content &ndash;&gt;-->
        <!--&lt;!&ndash;          <template v-slot:header>&ndash;&gt;-->
        <!--&lt;!&ndash;            <span class="text-h5">App-Level Custom Title</span>&ndash;&gt;-->
        <!--&lt;!&ndash;          </template>&ndash;&gt;-->

        <!--          &lt;!&ndash; Custom Body Content &ndash;&gt;-->
        <!--          <template v-slot:body>-->
        <!--            <p>This content is coming directly from <strong>App.vue</strong>.</p>-->
        <!--            <v-alert type="info">-->
        <!--              The intermediate component is skipped!-->
        <!--            </v-alert>-->
        <!--          </template>-->

        <!--          &lt;!&ndash; Custom Actions &ndash;&gt;-->
        <!--          <template v-slot:actions>-->
        <!--            <v-btn color="secondary" @click="dialogVisible = false">Cancel</v-btn>-->
        <!--            <v-btn color="success" @click="saveAndClose">Save</v-btn>-->
        <!--          </template>-->

        <!--        </ReusableDialog>-->
        <!-- Use in intermediate component -->
        <ComponentA v-model="dialogVisible"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import {ref, watch} from 'vue';

import ComponentA from '@/components/ExampleDialogComponent.vue';
// import ReusableDialog from '@/components/DialogWindow.vue'; // Import the reusable component

const dialogVisible = ref(false);

const saveAndClose = () => {
  // Handle save logic here
  console.log("Saving data in App.vue...");
  dialogVisible.value = false;
};

// const handleOpen = () => {
//   console.log('--> Dialog is opening! Run open function here.');
// };
//
const handleClose = () => {
  console.log('--> Dialog is closing! Run close function here.');
};

// Function called by the primary button
const openDialog = () => {
  dialogVisible.value = true;
  // handleOpen(); // Call open function immediately when button is clicked
};

// Use a watcher to observe changes to the dialogVisible state
watch(dialogVisible, (newValue, oldValue) => {
  // The 'openDialog' function handles the 'open' side when the button is clicked.
  // The 'watch' handles the 'close' side when the value is toggled off from within the dialog structure.
  if (newValue === false && oldValue === true) {
    handleClose();
  }
});
</script>
