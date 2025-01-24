<script lang="ts" setup>

import type { Database } from '~/database.types';

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

  await getLocations();

  locationName.value = '';
}

const locations = ref<any[]>([]);


async function getLocations() {
  const { data, error } = await client.from('Location').select('*');

  if (error) {
    console.error('Error fetching locations:', error);
    return;
  }

  locations.value = data || [];
}

getLocations();

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
