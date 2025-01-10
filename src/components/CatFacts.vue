<template>
  <div v-if="!backendError">
    <Toolbar>
      <template #start>
        <Button label="New" icon="pi pi-plus" @click="openNew" />
      </template>
    </Toolbar>

    <DataTable :value="catFacts" dataKey="id" :loading="loadingCatFacts">
      <Column field="id" header="UUID"></Column>
      <Column field="description" header="Description"></Column>
      <Column :exportable="false">
        <template #body="slotProps">
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteFact(slotProps.data)" />
        </template>
      </Column>
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

  <Dialog v-model:visible="deleteFactDialog" header="Confirm" :modal="true">
    <div class="flex flex-col justify-center">
      <div class="flex items-center pb-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete this cat fact? 😿</span>
      </div>
      <div class="flex items-center max-w-64 bg-slate-100 rounded shadow mx-auto">
        <small class="truncate ...">{{ catFact.description }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteFactDialog = false" />
      <Button label="Yes" icon="pi pi-check" :loading="deletingCatFact" @click="deleteFact" />
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
const deleteFactDialog = ref(false);
const deletingCatFact = ref(false);

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

  if (catFact?.value.description?.trim()) {
    savingCatFact.value = true;
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

const confirmDeleteFact = (prod: CatFact) => {
  catFact.value = prod;
  deleteFactDialog.value = true;
}

const deleteFact = () => {
  deletingCatFact.value = true;
  axios
    .delete(`/${catFact.value.id}`)
    .then(() => {
      toast.add({severity:'success', summary: 'Successful', detail: 'Fact deleted', life: 3000});
      fetchCatFacts();
    })
    .catch(error => {
      toast.add({severity:'error', summary: 'Error', detail: `Error deleting fact: ${error}`, life: 3000});
    })
    .finally(() => {
      deleteFactDialog.value = false;
      catFact.value = {};
      deletingCatFact.value = false;
    });
}

</script>
