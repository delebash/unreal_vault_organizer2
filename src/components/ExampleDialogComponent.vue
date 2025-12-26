<!-- ExampleDialogComponent.vue -->
<template>
  <!--
    We pass the modelValue down and listen for updates.
    The dialog is hidden by default here. The parent App.vue controls when it shows.
  -->
  <ReusableDialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      last-position
  >
    <!-- Custom Header for Component A -->
    <template v-slot:header>
      <span class="text-h6">Welcome to Component A Dialog</span>
    </template>

    <!-- Custom Body for Component A -->
    <!--    <template v-slot:body>-->
    <!--      <p>This is specific content injected from **Component A**.</p>-->
    <!--      <v-text-field label="Enter something"></v-text-field>-->
    <!--    </template>-->

    <!-- Custom Actions for Component A -->
    <template v-slot:actions>
      <v-btn color="error" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn color="success" @click="handleSaveAndClose">Save</v-btn>
    </template>
  </ReusableDialog>
</template>

<script setup>
import ReusableDialog from './DialogWindow.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleSaveAndClose = () => {
  // You might do specific Component A logic here before closing
  console.log('Component A preparing to close...');
  // Emit close event
  emit('update:modelValue', false);
};
</script>
