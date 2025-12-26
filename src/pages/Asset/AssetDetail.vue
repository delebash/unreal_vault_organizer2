<template>
  <!-- Use the reusable dialog component -->

  <DialogWindow
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Asset Details"
      :lastPosition="false"
      :dialogWidth="600"
      :dialogHeight="400"
  >
    <!-- Custom Header for Component A -->
    <template v-slot:header>
      <!--      <span class="text-h6">Welcome to Component A Dialog</span>-->
    </template>

    <!--     Custom Body for DailogWindow -->
    <template v-slot:body>
      <!-- Content within these tags goes into the <slot> in CustomFormDialog -->
      <v-card v-if="product">
        <!-- ... (Image, Title, Subtitle, and Description content) ... -->
        <v-img
            :src="product.imageUrl"
            aspect-ratio="2"
            cover
        ></v-img>

        <v-card-title class="headline">{{ product.name }}</v-card-title>
        <v-card-subtitle>{{ product.location }}</v-card-subtitle>

        <v-card-text>
          <p>This is a detailed description for {{ product.name }}. More information can go here.</p>
          <div class="mt-2">
            <v-chip
                v-for="tag in product.tags"
                :key="tag"
                class="ma-1"
            >
              {{ tag }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Custom Actions for Detail -->
    <template v-slot:actions>
      <!-- Optional Save Button -->
      <v-btn
          color="teal-darken-4"
          variant="flat"
          @click="handleSave"
      >
        Save Product
      </v-btn>

      <!-- Close Button -->
      <v-btn
          color="primary"
          variant="text"
          @click="handleClose"
      >
        Close
      </v-btn>
      <v-btn color="error" @click="handleClose">
        Cancel
      </v-btn>
      <v-btn color="success" @click="handleSave">Save</v-btn>
    </template>

  </DialogWindow>

</template>

<script setup>
import {ref} from 'vue';
import DialogWindow from '@/components/DialogWindow.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object,
    default: null
  },
});
//
// const product = ref(product);
console.log(props.product)
const emit = defineEmits(['update:modelValue', 'close', 'save']);

const handleClose = () => {
  // You might do specific Component A logic here before closing
  console.log('Component A preparing to close...');
  // Emit close event
  // emit('update:modelValue', false);
  emit('save', product);
};

const handleSave = () => {
  // You might do specific Component A logic here before closing
  console.log('Component A preparing to close...');
  // Emit close event
  // emit('update:modelValue', false);
  emit('close');
};


</script>
