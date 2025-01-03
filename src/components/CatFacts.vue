<template>
  <DataTable :value="catFacts" tableStyle="min-width: 50rem">
    <Column field="id" header="UUID"></Column>
    <Column field="description" header="Description"></Column>
  </DataTable>
</template>

<script setup lang="ts">

import {ref, onMounted} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from "axios";


onMounted(() => {
  axios
    .get('http://127.0.0.1:8000/cat_facts/')
    .then(response => (catFacts.value = response.data))
});

const catFacts = ref();

</script>
