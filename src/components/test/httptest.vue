<script setup>
import {ref} from "vue";
// import { invoke } from "@tauri-apps/api/core";
import {fetch} from '@tauri-apps/plugin-http';
import jsonData from './assets/data.json'

let message = ref('')

async function getData1() {
  let promiseArray = []
  let assetDetails = []
  let listingIdentifier

  let count = 0
  let options = {
    headers: {
      'Content-Type': 'application/json',
    }
  }

  //Load data and urls in promise
  try {
    for (let asset of jsonData) {
      if (asset.customAttributes) {
        const objListingIdentifier = asset.customAttributes.find(obj => Object.hasOwn(obj, 'ListingIdentifier'));
        listingIdentifier = objListingIdentifier?.ListingIdentifier || null;
      }
      if (listingIdentifier !== null) {
        let url = `https://www.fab.com/i/listings/${listingIdentifier}`
        promiseArray.push(httpRequest(url, options).then((assetDetail) => {
          if (typeof assetDetail === 'object') {
            assetDetails.push(assetDetail)
            message.value = `Assets downloaded ' ${count}`
          }
        }));
      }
    }
    await Promise.all(promiseArray);

    message.value = `Success asset details, total number of assets: ${assetDetails.length}`
  } catch (err) {
    console.error(err);
  }
}


const BATCH_SIZE = 500;
const DELAY_MS = 300; // 1 second delay

async function getData() {
  try {
    let urls = getUrls();
    const allResults = await batchFetchRequests(urls, BATCH_SIZE, DELAY_MS);
    message.value = `Success asset details, total number of assets: ${allResults.results.length}`
    console.log("All results:", allResults.results);
    console.log("All errors:", allResults.errors);
  } catch (error) {
    console.error("Error during batched fetch:", error);
  }
}

function getUrls() {
  let urls = []
  let listingIdentifier
  try {
    for (let asset of jsonData) {
      if (asset.customAttributes) {
        const objListingIdentifier = asset.customAttributes.find(obj => Object.hasOwn(obj, 'ListingIdentifier'));
        listingIdentifier = objListingIdentifier?.ListingIdentifier || null;
      }
      if (listingIdentifier !== null) {
        let url = `https://www.fab.com/i/listings/${listingIdentifier}`
        urls.push(url)
      }
    }
  } catch (error) {
    console.error(error)
  }
  return urls;
}

async function batchFetchRequests(urls, batchSize = 500, delayMs = 100) {
  const results = [];
  const errors = []
  const totalRequests = urls.length;
  let completedRequests = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize); // Get a slice of URLs for the current batch

    // Create an array of Promises for each fetch request in the batch
    const batchPromises = batchUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        let responseData = await response.json();
        if (!response.ok) {
          errors.push({
            url: url,
            message: responseData,
            error: response.statusText
          })
        }
        if (typeof responseData === 'object') {
          completedRequests++;
          updateProgress(completedRequests, totalRequests);
          // message.value = `Assets downloaded ' ${completedCount}`
          return responseData
        }
      } catch (error) {
        errors.push({url: url, message: error.message, error: error})
        return null; // Handle individual fetch errors gracefully
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // If there are more batches to process, introduce a delay
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return {results: results, errors: errors};
}

/**
 * Helper function to update progress (can be customized for UI updates).
 */
function updateProgress(completed, total) {
  const progress = Math.round((completed / total) * 100);
  message.value=`Progress: ${completed}/${total} (${progress}%)`
  // Example UI update: document.getElementById('progressBar').style.width = `${progress}%`;
}

</script>

<template>
  <button @click="getData">Run http requests</button>
  <p>{{ message }}</p>
</template>

<style scoped>

</style>
