<template>
  <v-container fluid class="product-page-container pa-0">
    <v-card class="product-card">
      <v-card-title class="pa-4">

        <!-- Search Bar -->
        <v-text-field
            v-model="search"
            label="Search (Name, Location, etc.)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="mb-4"
        ></v-text-field>

        <!-- Container for Tags, Paging, and Mode Selector -->
        <div class="d-flex justify-space-between align-center flex-wrap w-100">
          <!-- Tag Filter Chips -->
          <div class="flex-grow-1 mb-4 mb-sm-0">
            <v-chip-group v-model="selectedTags" multiple column>
              <v-chip
                  v-for="tag in availableTags"
                  :key="tag"
                  filter
                  outlined
                  :value="tag"
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Filter Mode Selector -->
          <v-select
              v-model="filterMode"
              :items="['AND', 'OR']"
              label="Tag Mode"
              variant="outlined"
              density="compact"
              hide-details
              class="mx-4"
              style="max-width: 120px;"
          ></v-select>

          <!-- Paging Controls -->
          <div class="d-flex align-center ml-auto">
            <v-btn
                :disabled="currentPage === 1"
                icon="mdi-chevron-left"
                variant="tonal"
                class="me-2"
                @click="prevPage"
            ></v-btn>
            <span class="text-caption">Page {{ currentPage }} of {{ pageCount }}</span>
            <v-btn
                :disabled="currentPage === pageCount"
                icon="mdi-chevron-right"
                variant="tonal"
                class="ms-2"
                @click="nextPage"
            ></v-btn>
          </div>
        </div>
      </v-card-title>

      <!-- Scrollable Content Area -->
      <div class="scrollable-content-wrapper">
        <v-data-iterator
            :items="filteredItems"
            :items-per-page="itemsPerPage"
            hide-default-footer
            no-results-text="No items found matching your filter criteria"
        >
          <template v-slot:default="{ items }">
            <v-container fluid>
              <v-row dense>
                <v-col
                    v-for="item in items"
                    :key="item.raw.name"
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                    x-lg="1"
                >

                  <!--                  <v-card class="product-card-overlay">-->
                  <!--                    &lt;!&ndash; v-img component uses the imageUrl property &ndash;&gt;-->
                  <!--                    <v-img-->
                  <!--                        :src="item.raw.imageUrl"-->
                  <!--                        :width="100"-->
                  <!--                        aspect-ratio="1/1"-->
                  <!--                        cover-->
                  <!--                        class="align-end"-->
                  <!--                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)"-->
                  <!--                    ></v-img>-->

                  <!--                    <v-card-title>{{ item.raw.name }}</v-card-title>-->
                  <!--                    <v-card-subtitle>{{ item.raw.location }}</v-card-subtitle>-->
                  <!--                    <v-card-text>-->
                  <!--                      <v-chip-->
                  <!--                          v-for="tag in item.raw.tags"-->
                  <!--                          :key="tag"-->
                  <!--                          small-->
                  <!--                          class="ma-1"-->
                  <!--                      >-->
                  <!--                        {{ tag }}-->
                  <!--                      </v-chip>-->
                  <!--                    </v-card-text>-->
                  <!--                  </v-card>-->
                  <!-- We remove height="100%" here as content is now contained in v-img -->
                  <!--                  <v-card class="product-card-overlay">-->

                  <!--                    &lt;!&ndash; v-img now contains the text content via its default slot &ndash;&gt;-->
                  <!--                    <v-img-->
                  <!--                        :src="item.raw.imageUrl"-->
                  <!--                        aspect-ratio="1"-->
                  <!--                        cover-->
                  <!--                        class="align-end"-->
                  <!--                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)"-->
                  <!--                    >-->
                  <!--                      &lt;!&ndash; Content is placed inside the image container &ndash;&gt;-->
                  <!--                      <div class="pa-2 text-white">-->
                  <!--                        <div class="text-caption font-weight-bold">{{ item.raw.name }}</div>-->
                  <!--                        <div class="text-caption">{{ item.raw.location }}</div>-->
                  <!--                        <div class="mt-1">-->
                  <!--                          <v-chip-->
                  <!--                              v-for="tag in item.raw.tags"-->
                  <!--                              :key="tag"-->
                  <!--                              size="x-small"-->
                  <!--                              class="ma-05"-->
                  <!--                              color="rgba(255, 255, 255, 0.3)"-->
                  <!--                              text-color="white"-->
                  <!--                          >-->
                  <!--                            {{ tag }}-->
                  <!--                          </v-chip>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                    </v-img>-->
                  <!--                  </v-card>-->

                  <v-card height="100%" density="compact">

                    <!-- Image component with overlaid Title/Subtitle -->
                    <v-img
                        :src="item.raw.imageUrl"
                        cover
                        height="125"
                        class="top-left-overlay"
                        gradient="to top right, rgba(0,0,0,.6), rgba(0,0,0,.1)"
                    >
                      <!--                      &lt;!&ndash; Content is placed inside the image container, aligned to the end (bottom) &ndash;&gt;-->
                      <!--                      <v-card-title class="text-caption font-weight-bold text-white py-1">-->
                      <!--                        {{ item.raw.name }}-->
                      <!--                      </v-card-title>-->
                      <!--                      <v-card-subtitle class="text-caption text-white pb-2">-->
                      <!--                        {{ item.raw.location }}-->
                      <!--                      </v-card-subtitle>-->
                      <!-- Content is placed inside the image container -->
                      <!-- Changed from v-card-title/subtitle back to divs for better text control inside the absolute positioned area -->
                      <!--                      <div class="pa-2 text-white">-->
                      <!--                        <div class="text-caption font-weight-bold">{{ item.raw.name }}</div>-->
                      <!--                        <div class="text-caption">{{ item.raw.location }}</div>-->
                      <!--                      </div>-->
                      <!-- Text size reduced further using 'text-xs' custom class -->
                      <div class="pa-1 text-white">
                        <div class="text-xs font-weight-bold">{{ item.raw.name }}</div>
                        <div class="text-xs">{{ item.raw.location }}</div>
                      </div>
                    </v-img>

                    <!-- Tags (below the image) -->
                    <v-card-text class="pa-1">
                      <v-chip
                          v-for="tag in item.raw.tags"
                          :key="tag"
                          size="x-small"
                          class="ma-05"
                      >
                        {{ tag }}
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-data-iterator>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import {ref, computed, watch} from 'vue';

// --- State Variables ---
const search = ref('');
const selectedTags = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;
const filterMode = ref('AND'); // Default mode is AND

// Mock Data with Images
const items = ref([
  {name: 'Northern Towns', location: 'Leeds', tags: ['tag1', 'tag3'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Things to do in Leeds', location: 'Yorkshire', tags: ['tag2', 'tag4'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Visit the beach', location: 'Cornwall', tags: ['tag1', 'tag2', 'tag3'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Hiking in the Moors', location: 'Yorkshire', tags: ['tag4'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Explore Cornwall Coast', location: 'Cornwall', tags: ['tag1', 'tag2'], imageUrl: 'https://picsum.photos/50'},
  {name: 'City Break Manchester', location: 'Manchester', tags: ['tag1', 'tag4'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Lake District Views', location: 'Cumbria', tags: ['tag3'], imageUrl: 'https://picsum.photos/50'},
  {name: 'Peak District Walk', location: 'Derbyshire', tags: ['tag2'], imageUrl: 'https://picsum.photos/50'},
  {name: 'London Calling', location: 'London', tags: ['tag1', 'tag2'], imageUrl: 'https://picsum.photos/50'},
]);
const availableTags = ref(['tag1', 'tag2', 'tag3', 'tag4']);


// --- Computed Properties ---

const allMatchingItems = computed(() => {
  let result = items.value;
  // ... (Filter logic for search and filterMode remains the same as previous response) ...
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(item => item.name.toLowerCase().includes(searchTerm) || item.location.toLowerCase().includes(searchTerm));
  }

  if (selectedTags.value.length > 0) {
    result = result.filter(item => {
      const itemTags = item.tags;
      if (filterMode.value === 'AND') {
        return selectedTags.value.every(selectedTag => itemTags.includes(selectedTag));
      } else {
        return selectedTags.value.some(selectedTag => itemTags.includes(selectedTag));
      }
    });
  }
  return result;
});

const filteredItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allMatchingItems.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(allMatchingItems.value.length / itemsPerPage);
});


// --- Functions (Methods) ---

const nextPage = () => {
  if (currentPage.value < pageCount.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};


// --- Watchers ---
watch([search, selectedTags, filterMode], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* This calculation is vital: 100vh minus space reserved by ALL 'app' components */
.product-page-container {
  height: calc(100vh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px));
  display: flex;
  flex-direction: column;
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scrollable-content-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* Utility class for very small margin */
.ma-05 {
  margin: 2px !important;
}

/*
   CUSTOM CSS:
   v-img uses absolute positioning internally for its content slot.
   We target the internal content wrapper using a deep selector
   or specific class to override the default alignment (Vuetify usually uses align-center).
   The simplest way is often to use flex utility classes, but when that fails,
   custom CSS like this works.
*/
.top-left-overlay :deep(.v-img__content) {
  align-items: flex-start; /* Align content to the top */
  justify-content: flex-start; /* Align content to the left */
}
</style>
