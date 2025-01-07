<template>
  <div v-if="!backendError">
    <Toolbar>
      <template #start>
        <Button label="New" icon="pi pi-plus" @click="openNew" />
      </template>
    </Toolbar>

    <DataTable :value="catFacts" :loading="loadingCatFacts">
      <Column field="id" header="UUID"></Column>
      <Column field="description" header="Description"></Column>
    </DataTable>
  </div>
  <div v-else>
    <h2>😿 There was an error fetching the data from the backend. Please try again later.</h2>
  </div>

  <Dialog v-model:visible="catFactDialog" header="Cat fact details" :modal="true">
    <div>
      <label for="description">Description</label>
      <Textarea id="description" v-model="catFact.description" required="true" rows="3" cols="20" fluid autofocus
      :invalid="submitted && !catFact.description" />
      <small v-if="submitted && !catFact.description" class="text-red-500">Description is required.</small>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" :loading="savingCatFact" icon="pi pi-check" @click="saveFact" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">

import {ref, onMounted} from 'vue';
import axios from "axios";
import { useToast } from 'primevue/usetoast';

interface CatFact {
  id?: string;
  description?: string;
}

const toast = useToast();
const catFacts = ref();
const catFact = ref({} as CatFact);
const catFactDialog = ref(false);
const submitted = ref(false);
const loadingCatFacts = ref(true);
const savingCatFact = ref(false);
const backendError = ref(false);

onMounted(() => {
  fetchCatFacts();
});

const fetchCatFacts = () => {
  loadingCatFacts.value = true;
  axios
    .get('/')
    .then(response => { catFacts.value = response.data; backendError.value = false; })
    .catch(() => { backendError.value = true; })
    .finally(() => { loadingCatFacts.value = false; });
};

const openNew = () => {
  catFact.value = {};
  submitted.value = false;
  catFactDialog.value = true;
};

const hideDialog = () => {
  catFactDialog.value = false;
  submitted.value = false;
};

const saveFact = () => {
  submitted.value = true;
  savingCatFact.value = true;

  if (catFact?.value.description?.trim()) {
    axios
      .post('/', { description: catFact.value.description })
      .then(() => {
        toast.add({severity:'success', summary: 'Successful', detail: 'Fact added', life: 3000});
        fetchCatFacts();
      })
      .catch(error => {
        toast.add({severity:'error', summary: 'Error', detail: `Error adding fact: ${error}`, life: 3000});
      })
      .finally(() => {
        catFactDialog.value = false;
        catFact.value = {};
        savingCatFact.value = false;
      });
  }
};

</script>
