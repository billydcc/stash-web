<script lang="ts" setup>

import type { Database } from '~/database.types';

import type { Location } from '~/api/models';

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const locationName = ref('');

watchEffect(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})

function signOut() {
  client.auth.signOut();
  navigateTo('/login')
}

async function createLocation() {
  const { data, error } = await client.from('Location').insert({
    name: locationName.value,
  }).select();

  if (error) {
    console.error('Error creating location:', error);
    return;
  }

  await fetchLocationData();

  locationName.value = '';
}

const locations = ref<Location[]>([]);

const session = useSupabaseSession();
const token = session?.value?.access_token;
const config = useRuntimeConfig()

// Fetch locations from the API.
async function fetchLocationData() {
  const { data, error } = await useFetch<Location[]>(`${config.public.apiBase}/location`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if (data.value) {
    locations.value = data.value;
  }
  else {
    alert(error.value)
  }
}

fetchLocationData();

const setPassword = async () => {
  const { error } = await client.auth.updateUser({
    password: 'Password123'
  })
  if (error) console.log(error)
}

</script>

<template>


  <UCard>
    <UButton @click="setPassword">Set Password</UButton>
    <template #header>
      <div class=" flex justify-between items-center">
        <h3 class="text-xl font-medium">Locations</h3>
        <div class=" flex gap-2">
          <UInput v-model="locationName" placeholder="Location name" />
          <UButton @click="createLocation">Create</UButton>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <ULink v-for="location in locations" class=" hover:text-primary  " :key="location.id"
        :to="`/location/${location.id}`">
        {{ location.name }}
      </ULink>
    </div>
  </UCard>

</template>

<style></style>
