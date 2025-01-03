<template>
  <DataTable v-if="!backendError" :value="catFacts" :loading="loadingCatFacts">
    <Column field="id" header="UUID"></Column>
    <Column field="description" header="Description"></Column>
  </DataTable>
  <div v-else>
    <h2>😿 There was an error fetching the data from the backend. Please try again later.</h2>
  </div>
</template>

<script setup lang="ts">

import {ref, onMounted} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from "axios";


onMounted(() => {
  axios
    .get('/')
    .then(response => { catFacts.value = response.data; backendError.value = false; })
    .catch(() => { backendError.value = true; })
    .finally(() => { loadingCatFacts.value = false; });
});

const catFacts = ref();
const loadingCatFacts = ref(true);
const backendError = ref(false);

</script>
